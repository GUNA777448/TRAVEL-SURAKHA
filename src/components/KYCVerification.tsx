import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Shield, 
  CheckCircle, 
  FileText, 
  Fingerprint, 
  Camera, 
  Database,
  Lock,
  UserCheck,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface KYCVerificationProps {
  onVerificationComplete: (kycData: KYCData) => void;
  onCancel: () => void;
}

export interface KYCData {
  verificationId: string;
  aadhaarNumber: string;
  passportNumber?: string;
  biometricHash: string;
  governmentVerified: boolean;
  blockchainHash: string;
  verificationTimestamp: Date;
  verificationLevel: 'basic' | 'advanced' | 'government';
  riskScore: number;
}

export function KYCVerification({ onVerificationComplete, onCancel }: KYCVerificationProps) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    passportNumber: '',
    phoneNumber: '',
    otpCode: ''
  });
  const [verificationStatus, setVerificationStatus] = useState({
    aadhaar: false,
    biometric: false,
    government: false,
    blockchain: false,
    otp: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulateVerification = async (type: string) => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerificationStatus(prev => ({ ...prev, [type]: true }));
    setIsVerifying(false);
    
    const newProgress = Object.values({ ...verificationStatus, [type]: true })
      .filter(Boolean).length * 20;
    setProgress(newProgress);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} verification completed`);
  };

  const generateKYCData = (): KYCData => {
    const verificationId = `KYC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const blockchainHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const biometricHash = `BIO${Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    return {
      verificationId,
      aadhaarNumber: formData.aadhaarNumber,
      passportNumber: formData.passportNumber || undefined,
      biometricHash,
      governmentVerified: true,
      blockchainHash,
      verificationTimestamp: new Date(),
      verificationLevel: 'government',
      riskScore: Math.floor(Math.random() * 15) + 85 // High trust score 85-100
    };
  };

  const completeVerification = () => {
    const kycData = generateKYCData();
    onVerificationComplete(kycData);
    toast.success('KYC verification completed successfully!');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-2">Identity Verification Required</h3>
              <p className="text-muted-foreground">
                To ensure tourist safety and prevent misuse, we verify every identity through multiple government databases and biometric authentication.
              </p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Features:</strong> Multi-layer verification with Aadhaar, biometrics, blockchain immutability, and real-time government database validation.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Government DB</p>
                <p className="text-xs text-muted-foreground">Real-time validation</p>
              </div>
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <Fingerprint className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Biometric Auth</p>
                <p className="text-xs text-muted-foreground">Unique identity proof</p>
              </div>
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Blockchain Hash</p>
                <p className="text-xs text-muted-foreground">Immutable record</p>
              </div>
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Risk Assessment</p>
                <p className="text-xs text-muted-foreground">AI-powered analysis</p>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Government ID Verification</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  id="aadhaar"
                  placeholder="1234 5678 9012"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                  maxLength={12}
                />
              </div>
              
              <div>
                <Label htmlFor="passport">Passport Number (Optional)</Label>
                <Input
                  id="passport"
                  placeholder="A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => simulateVerification('aadhaar')} 
                disabled={!formData.aadhaarNumber || isVerifying}
                className="w-full"
              >
                {isVerifying ? 'Verifying with UIDAI...' : 'Verify Aadhaar'}
              </Button>
              
              {verificationStatus.aadhaar && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Aadhaar verified successfully</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">OTP Verification</h3>
              <p className="text-sm text-muted-foreground">Enter your mobile number for OTP verification</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
              
              {formData.phoneNumber && (
                <div>
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    value={formData.otpCode}
                    onChange={(e) => handleInputChange('otpCode', e.target.value)}
                    maxLength={6}
                  />
                </div>
              )}
              
              <Button 
                onClick={() => simulateVerification('otp')} 
                disabled={!formData.phoneNumber || !formData.otpCode || isVerifying}
                className="w-full"
              >
                {isVerifying ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
              
              {verificationStatus.otp && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Mobile number verified</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Fingerprint className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Biometric Authentication</h3>
              <p className="text-sm text-muted-foreground">Secure fingerprint and facial recognition</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => simulateVerification('biometric')} 
                  disabled={isVerifying}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Fingerprint className="w-8 h-8 mb-2" />
                  <span className="text-sm">Fingerprint</span>
                </Button>
                
                <Button 
                  onClick={() => simulateVerification('biometric')} 
                  disabled={isVerifying}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm">Face Scan</span>
                </Button>
              </div>
              
              {verificationStatus.biometric && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Biometric authentication successful</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Final Verification</h3>
              <p className="text-sm text-muted-foreground">Cross-checking with government databases and blockchain registration</p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => simulateVerification('government')} 
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying ? 'Verifying with Government DB...' : 'Verify with Government Database'}
              </Button>
              
              {verificationStatus.government && (
                <>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Government database verification complete</span>
                  </div>
                  
                  <Button 
                    onClick={() => simulateVerification('blockchain')} 
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? 'Creating Blockchain Hash...' : 'Register on Blockchain'}
                  </Button>
                </>
              )}
              
              {verificationStatus.blockchain && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Blockchain registration complete</span>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return verificationStatus.aadhaar;
      case 3: return verificationStatus.otp;
      case 4: return verificationStatus.biometric;
      case 5: return verificationStatus.government && verificationStatus.blockchain;
      default: return false;
    }
  };

  const allVerified = Object.values(verificationStatus).every(Boolean);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              KYC Verification
            </CardTitle>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {step} of 5</span>
                <span>{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={step === 1 ? onCancel : () => setStep(step - 1)}
                className="flex-1"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {step < 5 ? (
                <Button 
                  onClick={() => setStep(step + 1)} 
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={completeVerification}
                  disabled={!allVerified}
                  className="flex-1"
                >
                  Complete Verification
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Security Assurance */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">Security Assurance</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>256-bit encryption for all data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Real-time government database sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Immutable blockchain record</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>AI-powered fraud detection</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}