import React, { useState } from 'react';
import { Tourist } from './TouristApp';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface SOSButtonProps {
  user: Tourist;
}

export function SOSButton({ user }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSOSPress = () => {
    if (isPressed) return;

    setIsPressed(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          sendSOSAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-cancel after 3 seconds if not confirmed
    setTimeout(() => {
      if (isPressed) {
        setIsPressed(false);
        setCountdown(0);
      }
    }, 3000);
  };

  const sendSOSAlert = () => {
    // Simulate SOS alert being sent
    const alertData = {
      userId: user.digitalId,
      name: user.name,
      location: user.location,
      timestamp: new Date().toISOString(),
      emergencyContact: user.emergencyContact
    };

    console.log('SOS Alert Sent:', alertData);

    toast.success('🚨 SOS Alert Sent Successfully!', {
      description: `Emergency services and ${user.emergencyContact} have been notified.`,
      duration: 5000,
    });

    // Reset button state
    setIsPressed(false);
    setCountdown(0);
  };

  const cancelSOS = () => {
    setIsPressed(false);
    setCountdown(0);
    toast.info('SOS Alert Cancelled');
  };

  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Emergency SOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isPressed ? (
          <div className="text-center space-y-4">
            <Button
              className="w-full h-16 text-lg text-white border-2"
              style={{ backgroundColor: '#FF5A5F', borderColor: '#FF5A5F' }}
              onClick={handleSOSPress}
            >
              <AlertTriangle className="w-6 h-6 mr-2" />
              PRESS FOR EMERGENCY
            </Button>
            <p className="text-sm text-gray-600">
              Sends your location + ID to police and emergency contact
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-2xl text-red-600 mb-2">
              Sending SOS in {countdown}...
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={cancelSOS}
              >
                Cancel SOS
              </Button>
              <p className="text-sm text-gray-600">
                Alert will be sent automatically in {countdown} seconds
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Your ID:</span>
              <span className="font-mono text-xs">{user.digitalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Emergency Contact:</span>
              <span className="text-xs">{user.emergencyContact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="text-xs">
                {user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}