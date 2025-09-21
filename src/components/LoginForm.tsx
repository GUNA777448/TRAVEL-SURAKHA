import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tourist } from './TouristApp';
import { KYCVerification, KYCData } from './KYCVerification';
import { Shield, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

// Demo users data with KYC status
const demoUsers = [
  { name: 'Hasini', age: 25, contact: '+91-9876543201', emergencyContact: '+91-9876543301', kycVerified: true },
  { name: 'Ehalya', age: 28, contact: '+91-9876543202', emergencyContact: '+91-9876543302', kycVerified: true },
  { name: 'Harshitha', age: 24, contact: '+91-9876543203', emergencyContact: '+91-9876543303', kycVerified: true },
  { name: 'Saranya', age: 26, contact: '+91-9876543204', emergencyContact: '+91-9876543304', kycVerified: true },
  { name: 'Harsha', age: 27, contact: '+91-9876543205', emergencyContact: '+91-9876543305', kycVerified: true },
  { name: 'Kundhan', age: 29, contact: '+91-9876543206', emergencyContact: '+91-9876543306', kycVerified: true }
];

interface LoginFormProps {
  onLogin: (user: Tourist) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    emergencyContact: ''
  });
  const [kycData, setKycData] = useState<KYCData | null>(null);

  const generateDigitalId = (kycData?: KYCData) => {
    if (kycData) {
      return `KYC-${kycData.verificationId}-${Date.now()}`;
    }
    return `DID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getRandomLocation = () => {
    // Mock locations in different zones
    const locations = [
      { lat: 12.9716, lng: 77.5946, zone: 'safe' as const }, // Bangalore safe area
      { lat: 12.9352, lng: 77.6245, zone: 'caution' as const }, // Caution zone
      { lat: 12.9010, lng: 77.6040, zone: 'danger' as const }, // Danger zone
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const handleKYCComplete = (verifiedKycData: KYCData) => {
    setKycData(verifiedKycData);
    setShowKYC(false);
    
    const location = getRandomLocation();
    const user: Tourist = {
      id: `kyc-${verifiedKycData.verificationId}`,
      name: formData.name,
      age: parseInt(formData.age),
      contact: formData.contact,
      emergencyContact: formData.emergencyContact,
      digitalId: generateDigitalId(verifiedKycData),
      isActive: true,
      lastSeen: new Date(),
      location: { lat: location.lat, lng: location.lng },
      zone: location.zone,
      kycData: verifiedKycData
    };

    toast.success(`Welcome ${user.name}! Your verified digital ID is ready.`);
    onLogin(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if basic form is filled
    if (!formData.name || !formData.age || !formData.contact || !formData.emergencyContact) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Start KYC verification process
    setShowKYC(true);
  };

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    const location = getRandomLocation();
    
    // Create mock KYC data for demo users
    const mockKycData: KYCData = {
      verificationId: `DEMO${demoUser.name.toUpperCase()}${Date.now()}`,
      aadhaarNumber: `${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
      biometricHash: `BIO${Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      governmentVerified: true,
      blockchainHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      verificationTimestamp: new Date(),
      verificationLevel: 'government',
      riskScore: Math.floor(Math.random() * 10) + 90 // High trust score 90-100 for demo users
    };
    
    const user: Tourist = {
      id: `demo-${demoUser.name.toLowerCase()}`,
      name: demoUser.name,
      age: demoUser.age,
      contact: demoUser.contact,
      emergencyContact: demoUser.emergencyContact,
      digitalId: generateDigitalId(mockKycData),
      isActive: true,
      lastSeen: new Date(),
      location: { lat: location.lat, lng: location.lng },
      zone: location.zone,
      kycData: mockKycData
    };

    onLogin(user);
  };

  if (showKYC) {
    return (
      <KYCVerification 
        onVerificationComplete={handleKYCComplete}
        onCancel={() => setShowKYC(false)}
      />
    );
  }

  return (
    <div className="p-4">
      {/* Security Notice */}
      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Secure Tourist ID System:</strong> All registrations require government-verified KYC with biometric authentication and blockchain immutability to prevent misuse by unauthorized individuals.
        </AlertDescription>
      </Alert>

      <Card className="mt-6 border-0 shadow-soft bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            {isRegistering ? 'Secure Registration' : 'Tourist Login'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {isRegistering ? 'Create your verified digital tourist ID' : 'Access your secure digital identity'}
          </p>
        </CardHeader>
        <CardContent>
          {isRegistering ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-input-background border-border focus:ring-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="age" className="text-foreground">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                  min="18"
                  max="100"
                  className="bg-input-background border-border focus:ring-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="contact" className="text-foreground">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="+91-XXXXX-XXXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                  className="bg-input-background border-border focus:ring-primary"
                />
              </div>
              
              <div>
                <Label htmlFor="emergency" className="text-foreground">Emergency Contact</Label>
                <Input
                  id="emergency"
                  type="tel"
                  placeholder="+91-XXXXX-XXXXX"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  required
                  className="bg-input-background border-border focus:ring-primary"
                />
              </div>
              
              <Alert className="border-accent/20 bg-accent/5">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertDescription className="text-sm">
                  Next step: Complete KYC verification with Aadhaar, biometric authentication, and government database validation.
                </AlertDescription>
              </Alert>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Proceed to KYC Verification
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-border text-foreground hover:bg-secondary/50"
                onClick={() => setIsRegistering(false)}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Demo Login - All users are pre-verified with government KYC
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {demoUsers.map((user) => (
                  <Card
                    key={user.name}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg border-border bg-card/50 hover:bg-card/80"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{user.name}</span>
                            {user.kycVerified && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                KYC Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">Age {user.age} • {user.contact}</div>
                        </div>
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="border-t border-border pt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => setIsRegistering(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register New User with KYC
                </Button>
              </div>
              
              {/* Security Features Display */}
              <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground text-sm">Security Features Active:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Aadhaar Verified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Biometric Auth</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Blockchain Secured</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Gov DB Validated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}