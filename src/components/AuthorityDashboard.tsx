import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertSystem } from './AlertSystem';
import { 
  ArrowLeft, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Camera,
  FileText,
  Shield
} from 'lucide-react';

interface AuthorityDashboardProps {
  onBack: () => void;
}

// Mock active tourists data
const mockTourists = [
  { 
    id: 'demo-hasini', 
    name: 'Hasini', 
    digitalId: 'DID-1734567890-abc123456',
    zone: 'danger',
    lastSeen: new Date(Date.now() - 2000),
    location: { lat: 12.9010, lng: 77.6040 },
    contact: '+91-9876543201'
  },
  { 
    id: 'demo-ehalya', 
    name: 'Ehalya', 
    digitalId: 'DID-1734567891-def789012',
    zone: 'safe',
    lastSeen: new Date(Date.now() - 5000),
    location: { lat: 12.9716, lng: 77.5946 },
    contact: '+91-9876543202'
  },
  { 
    id: 'demo-harshitha', 
    name: 'Harshitha', 
    digitalId: 'DID-1734567892-ghi345678',
    zone: 'safe',
    lastSeen: new Date(Date.now() - 8000),
    location: { lat: 12.9720, lng: 77.5950 },
    contact: '+91-9876543203'
  },
  { 
    id: 'demo-saranya', 
    name: 'Saranya', 
    digitalId: 'DID-1734567893-jkl901234',
    zone: 'caution',
    lastSeen: new Date(Date.now() - 16 * 60 * 1000), // 16 minutes ago - triggers silent alert
    location: { lat: 12.9352, lng: 77.6245 },
    contact: '+91-9876543204'
  },
  { 
    id: 'demo-harsha', 
    name: 'Harsha', 
    digitalId: 'DID-1734567894-mno567890',
    zone: 'safe',
    lastSeen: new Date(Date.now() - 3000),
    location: { lat: 12.9718, lng: 77.5948 },
    contact: '+91-9876543205'
  },
  { 
    id: 'demo-kundhan', 
    name: 'Kundhan', 
    digitalId: 'DID-1734567895-pqr123456',
    zone: 'caution',
    lastSeen: new Date(Date.now() - 7000),
    location: { lat: 12.9350, lng: 77.6243 },
    contact: '+91-9876543206'
  }
];

const mockSanitationReports = [
  {
    id: 'report-1',
    reporter: 'Harsha',
    description: 'Dirty restrooms near tourist center',
    location: { lat: 12.9718, lng: 77.5948 },
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    status: 'pending' as const
  },
  {
    id: 'report-2',
    reporter: 'Hasini',
    description: 'Overflowing trash bins at market entrance',
    location: { lat: 12.9010, lng: 77.6040 },
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: 'acknowledged' as const
  }
];

export function AuthorityDashboard({ onBack }: AuthorityDashboardProps) {
  const [currentTab, setCurrentTab] = useState<'overview' | 'map' | 'alerts' | 'sanitation'>('overview');
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'danger_zone' | 'silent_tourist' | 'sos' | 'sanitation';
    tourist?: string;
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>>([]);

  const [autoEFIREnabled, setAutoEFIREnabled] = useState(false);

  // Generate alerts based on tourist data
  useEffect(() => {
    const newAlerts = [];

    // Check for tourists in danger zones
    mockTourists.forEach(tourist => {
      if (tourist.zone === 'danger') {
        newAlerts.push({
          id: `danger-${tourist.id}`,
          type: 'danger_zone' as const,
          tourist: tourist.name,
          message: `${tourist.name} has entered a danger zone`,
          timestamp: new Date(),
          severity: 'high' as const
        });
      }

      // Check for silent tourists (no updates > 15 min)
      const timeSinceLastSeen = Date.now() - tourist.lastSeen.getTime();
      if (timeSinceLastSeen > 15 * 60 * 1000) {
        newAlerts.push({
          id: `silent-${tourist.id}`,
          type: 'silent_tourist' as const,
          tourist: tourist.name,
          message: `${tourist.name} has been silent for ${Math.floor(timeSinceLastSeen / (60 * 1000))} minutes`,
          timestamp: new Date(),
          severity: 'medium' as const
        });
      }
    });

    // Mock SOS alert for Kundhan (for demo)
    if (Math.random() < 0.3) { // 30% chance for demo
      newAlerts.push({
        id: 'sos-kundhan',
        type: 'sos' as const,
        tourist: 'Kundhan',
        message: 'Kundhan has pressed the SOS button - EMERGENCY',
        timestamp: new Date(),
        severity: 'critical' as const
      });
    }

    setAlerts(newAlerts);
  }, []);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'safe': return '#7ED957';
      case 'caution': return '#FFC857';
      case 'danger': return '#FF5A5F';
      default: return '#4A90E2';
    }
  };

  const getZoneText = (zone: string) => {
    switch (zone) {
      case 'safe': return 'Safe';
      case 'caution': return 'Caution';
      case 'danger': return 'Danger';
      default: return 'Unknown';
    }
  };

  const safeCount = mockTourists.filter(t => t.zone === 'safe').length;
  const cautionCount = mockTourists.filter(t => t.zone === 'caution').length;
  const dangerCount = mockTourists.filter(t => t.zone === 'danger').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl" style={{ color: '#4A90E2' }}>
                Authority Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Real-time tourist monitoring & safety management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {mockTourists.length} Active Tourists
            </Badge>
            <Badge 
              variant={alerts.length > 0 ? 'destructive' : 'secondary'}
            >
              {alerts.length} Alerts
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          <Button
            variant={currentTab === 'overview' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setCurrentTab('overview')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={currentTab === 'map' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setCurrentTab('map')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={currentTab === 'alerts' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setCurrentTab('alerts')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
          </Button>
          <Button
            variant={currentTab === 'sanitation' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setCurrentTab('sanitation')}
          >
            <Camera className="w-4 h-4 mr-2" />
            Sanitation
          </Button>
        </div>

        {/* Tab Content */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">{mockTourists.length}</div>
                  <div className="text-sm text-gray-600">Total Active</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2 text-green-600">{safeCount}</div>
                  <div className="text-sm text-gray-600">Safe Zone</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2" style={{ color: '#FFC857' }}>{cautionCount}</div>
                  <div className="text-sm text-gray-600">Caution Zone</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2 text-red-600">{dangerCount}</div>
                  <div className="text-sm text-gray-600">Danger Zone</div>
                </CardContent>
              </Card>
            </div>

            {/* Tourist List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Tourists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTourists.map((tourist) => {
                    const timeSinceLastSeen = Date.now() - tourist.lastSeen.getTime();
                    const minutesAgo = Math.floor(timeSinceLastSeen / (60 * 1000));
                    
                    return (
                      <div key={tourist.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getZoneColor(tourist.zone) }}
                          ></div>
                          <div>
                            <div className="font-medium">{tourist.name}</div>
                            <div className="text-sm text-gray-600">ID: {tourist.digitalId}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: getZoneColor(tourist.zone),
                              color: getZoneColor(tourist.zone)
                            }}
                          >
                            {getZoneText(tourist.zone)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentTab === 'map' && (
          <Card>
            <CardHeader>
              <CardTitle>Real-time Tourist Map</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock Map with all tourists */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border">
                {/* Background zones */}
                <div className="absolute inset-0">
                  {/* Safe zones */}
                  <div className="absolute rounded opacity-20" style={{
                    left: '20%', top: '30%', width: '40%', height: '25%',
                    backgroundColor: '#7ED957'
                  }}></div>
                  {/* Caution zones */}
                  <div className="absolute rounded opacity-20" style={{
                    left: '65%', top: '15%', width: '30%', height: '35%',
                    backgroundColor: '#FFC857'
                  }}></div>
                  {/* Danger zones */}
                  <div className="absolute rounded opacity-20" style={{
                    left: '15%', top: '65%', width: '35%', height: '20%',
                    backgroundColor: '#FF5A5F'
                  }}></div>
                </div>

                {/* Tourist markers */}
                {mockTourists.map((tourist, index) => {
                  const x = 20 + (index % 3) * 25 + Math.random() * 10;
                  const y = 20 + Math.floor(index / 3) * 30 + Math.random() * 10;
                  
                  return (
                    <div
                      key={tourist.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="relative">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: getZoneColor(tourist.zone) }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {tourist.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Heatmap indicator */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Crowded areas detected in Tourist Hub and Market Area</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentTab === 'alerts' && (
          <AlertSystem 
            alerts={alerts} 
            autoEFIREnabled={autoEFIREnabled}
            onToggleAutoEFIR={setAutoEFIREnabled}
          />
        )}

        {currentTab === 'sanitation' && (
          <Card>
            <CardHeader>
              <CardTitle>Sanitation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSanitationReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">Report by {report.reporter}</div>
                        <div className="text-sm text-gray-600">{report.description}</div>
                      </div>
                      <Badge 
                        variant={report.status === 'pending' ? 'destructive' : 'secondary'}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Location: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </span>
                      <span>{report.timestamp.toLocaleString()}</span>
                    </div>
                    {report.status === 'pending' && (
                      <div className="mt-3 space-x-2">
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline">
                          Assign Team
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}