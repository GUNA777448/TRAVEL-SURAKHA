import React, { useState, useEffect } from 'react';
import { Tourist } from './TouristApp';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { SOSButton } from './SOSButton';
import { SanitationReport } from './SanitationReport';
import { MapView } from './MapView';
import { 
  Shield, 
  MapPin, 
  Users, 
  Camera, 
  Clock,
  Smartphone,
  CheckCircle,
  Lock,
  Database,
  AlertTriangle
} from 'lucide-react';

interface TouristDashboardProps {
  user: Tourist;
}

export function TouristDashboard({ user }: TouristDashboardProps) {
  const [currentTab, setCurrentTab] = useState<'tracking' | 'companions' | 'sanitation' | 'kyc'>('tracking');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'safe': return 'hsl(var(--primary))';
      case 'caution': return 'hsl(var(--accent))';
      case 'danger': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--primary))';
    }
  };

  const getZoneText = (zone: string) => {
    switch (zone) {
      case 'safe': return 'Safe Zone';
      case 'caution': return 'Caution Zone';
      case 'danger': return 'Danger Zone';
      default: return 'Unknown';
    }
  };

  // Mock companion data
  const companions = [
    { name: 'Harsha', zone: 'safe', distance: '0.5 km' },
    { name: 'Ehalya', zone: 'caution', distance: '1.2 km' },
    { name: 'Harshitha', zone: 'safe', distance: '2.1 km' }
  ].filter(c => c.name !== user.name);

  return (
    <div className="p-4 space-y-4">
      {/* KYC Verification Status */}
      {user.kycData && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Verified Tourist ID:</strong> Government KYC completed with risk score {user.kycData.riskScore}/100
          </AlertDescription>
        </Alert>
      )}

      {/* Digital ID Card */}
      <Card className="border-0 shadow-soft bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            Verified Digital Tourist ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="font-medium text-foreground">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="text-sm font-mono text-foreground">{user.digitalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                className="text-white font-medium"
                style={{ backgroundColor: getZoneColor(user.zone) }}
              >
                {getZoneText(user.zone)}
              </Badge>
            </div>
            {user.kycData && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Verification:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  KYC Verified
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card className="border-0 shadow-soft bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Current Location</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="text-center mb-4">
            <div 
              className="inline-block w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: getZoneColor(user.zone) }}
            ></div>
            <span className="text-lg font-medium text-foreground">{getZoneText(user.zone)}</span>
            {user.zone === 'danger' && (
              <Alert className="mt-3 border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  You are in a danger zone. Please move to a safer area immediately.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency SOS */}
      <SOSButton user={user} />

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-secondary/30 p-1 rounded-lg">
        <Button
          variant={currentTab === 'tracking' ? 'default' : 'ghost'}
          className={`flex-1 text-sm ${currentTab === 'tracking' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'}`}
          onClick={() => setCurrentTab('tracking')}
        >
          <MapPin className="w-4 h-4 mr-1" />
          Tracking
        </Button>
        <Button
          variant={currentTab === 'companions' ? 'default' : 'ghost'}
          className={`flex-1 text-sm ${currentTab === 'companions' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'}`}
          onClick={() => setCurrentTab('companions')}
        >
          <Users className="w-4 h-4 mr-1" />
          Companions
        </Button>
        <Button
          variant={currentTab === 'sanitation' ? 'default' : 'ghost'}
          className={`flex-1 text-sm ${currentTab === 'sanitation' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'}`}
          onClick={() => setCurrentTab('sanitation')}
        >
          <Camera className="w-4 h-4 mr-1" />
          Report
        </Button>
        {user.kycData && (
          <Button
            variant={currentTab === 'kyc' ? 'default' : 'ghost'}
            className={`flex-1 text-sm ${currentTab === 'kyc' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/50'}`}
            onClick={() => setCurrentTab('kyc')}
          >
            <Shield className="w-4 h-4 mr-1" />
            KYC
          </Button>
        )}
      </div>

      {/* Tab Content */}
      {currentTab === 'tracking' && (
        <Card className="border-0 shadow-soft bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Live Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <MapView 
              userLocation={user.location} 
              userZone={user.zone}
              companions={companions}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">GPS Accuracy:</span>
                <span className="text-green-600 font-medium">High (±3m)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === 'companions' && (
        <Card className="border-0 shadow-soft bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Nearby Companions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companions.map((companion) => (
                <div key={companion.name} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getZoneColor(companion.zone) }}
                    ></div>
                    <span className="font-medium text-foreground">{companion.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-foreground">{companion.distance}</div>
                    <div className="text-xs text-muted-foreground">
                      {getZoneText(companion.zone)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === 'sanitation' && (
        <SanitationReport user={user} />
      )}

      {currentTab === 'kyc' && user.kycData && (
        <Card className="border-0 shadow-soft bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              KYC Verification Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-800">Government Verified</p>
                <p className="text-xs text-green-600">Aadhaar Authenticated</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <Lock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-800">Blockchain Secured</p>
                <p className="text-xs text-green-600">Immutable Record</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Verification ID:</span>
                <span className="text-xs font-mono text-foreground">{user.kycData.verificationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Risk Score:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {user.kycData.riskScore}/100 (Low Risk)
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Verification Level:</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {user.kycData.verificationLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Verified On:</span>
                <span className="text-sm text-foreground">{user.kycData.verificationTimestamp.toLocaleDateString()}</span>
              </div>
            </div>
            
            <Alert className="border-primary/20 bg-primary/5">
              <Database className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                This ID is cryptographically secured and linked to government databases. Any attempt at fraud will be immediately detected and reported to authorities.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}