import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  AlertTriangle, 
  UserX, 
  MapPin, 
  Camera,
  FileText,
  Clock,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'danger_zone' | 'silent_tourist' | 'sos' | 'sanitation';
  tourist?: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AlertSystemProps {
  alerts: Alert[];
  autoEFIREnabled: boolean;
  onToggleAutoEFIR: (enabled: boolean) => void;
}

export function AlertSystem({ alerts, autoEFIREnabled, onToggleAutoEFIR }: AlertSystemProps) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
    toast.success('Alert acknowledged');
  };

  const handleGenerateEFIR = (alert: Alert) => {
    const efirData = {
      alertId: alert.id,
      tourist: alert.tourist,
      type: alert.type,
      timestamp: alert.timestamp,
      location: 'Based on last known GPS coordinates',
      severity: alert.severity
    };

    console.log('Auto e-FIR Generated:', efirData);
    
    toast.success('📋 e-FIR Generated Successfully', {
      description: `Missing person report filed for ${alert.tourist}`,
      duration: 5000,
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger_zone': return <MapPin className="w-4 h-4" />;
      case 'silent_tourist': return <UserX className="w-4 h-4" />;
      case 'sos': return <AlertTriangle className="w-4 h-4" />;
      case 'sanitation': return <Camera className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      default: return 'outline';
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const highAlerts = alerts.filter(a => a.severity === 'high');
  const otherAlerts = alerts.filter(a => !['critical', 'high'].includes(a.severity));

  return (
    <div className="space-y-6">
      {/* Auto e-FIR Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-efir">Auto e-FIR Generation</Label>
              <p className="text-sm text-gray-600 mt-1">
                Automatically file missing person reports for silent tourists
              </p>
            </div>
            <Switch
              id="auto-efir"
              checked={autoEFIREnabled}
              onCheckedChange={onToggleAutoEFIR}
            />
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {!acknowledgedAlerts.has(alert.id) && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAcknowledge(alert.id)}
                        style={{ backgroundColor: '#4A90E2' }}
                      >
                        Acknowledge
                      </Button>
                    )}
                    
                    {alert.type === 'sos' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Phone className="w-3 h-3 mr-1" />
                          Call Emergency
                        </Button>
                        <Button size="sm" variant="outline">
                          Dispatch Team
                        </Button>
                      </>
                    )}
                    
                    {alert.type === 'silent_tourist' && autoEFIREnabled && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateEFIR(alert)}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Generate e-FIR
                      </Button>
                    )}
                  </div>
                  
                  {acknowledgedAlerts.has(alert.id) && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Acknowledged by authority
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Priority Alerts */}
      {highAlerts.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              High Priority Alerts ({highAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {highAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {!acknowledgedAlerts.has(alert.id) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  
                  {acknowledgedAlerts.has(alert.id) && (
                    <div className="text-sm text-green-600">
                      ✓ Acknowledged
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Alerts */}
      {otherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Other Alerts ({otherAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {!acknowledgedAlerts.has(alert.id) && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          ✓
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="w-12 h-12 mx-auto" />
            </div>
            <div className="text-gray-600">No active alerts</div>
            <div className="text-sm text-gray-500 mt-1">
              All tourists are safe and accounted for
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}