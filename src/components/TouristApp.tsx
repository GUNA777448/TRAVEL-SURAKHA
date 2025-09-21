import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { TouristDashboard } from './TouristDashboard';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { KYCData } from './KYCVerification';

export interface Tourist {
  id: string;
  name: string;
  age: number;
  contact: string;
  emergencyContact: string;
  digitalId: string;
  isActive: boolean;
  lastSeen: Date;
  location: { lat: number; lng: number };
  zone: 'safe' | 'caution' | 'danger';
  kycData?: KYCData;
}

interface TouristAppProps {
  onBack: () => void;
}

export function TouristApp({ onBack }: TouristAppProps) {
  const [currentUser, setCurrentUser] = useState<Tourist | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user: Tourist) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2 text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-primary">
            Suraksha Yatra
          </h1>
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-sm text-foreground hover:text-primary"
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <TouristDashboard user={currentUser!} />
        )}
      </div>
    </div>
  );
}