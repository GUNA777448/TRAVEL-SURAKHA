import React, { useState } from 'react';
import { TouristApp } from './components/TouristApp';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { Users, Shield } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'tourist' | 'authority'>('home');

  if (currentView === 'tourist') {
    return (
      <>
        <TouristApp onBack={() => setCurrentView('home')} />
        <Toaster />
      </>
    );
  }

  if (currentView === 'authority') {
    return (
      <>
        <AuthorityDashboard onBack={() => setCurrentView('home')} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-6 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1569866387587-1d1efc4a2372?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVubmluZyUyMG1vdW50YWluJTIwbGFuZHNjYXBlJTIwdHJhdmVsJTIwZGVzdGluYXRpb258ZW58MXx8fHwxNzU4MjEwNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        
        <div className="max-w-4xl w-full relative z-10 text-center">
          {/* Logo/Icon */}
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10" style={{ color: '#4CAF93' }} />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl mb-6" style={{ 
            fontWeight: '700', 
            fontFamily: 'Inter, sans-serif',
            color: '#2d3748',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Suraksha Yatra
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl mb-8" style={{ 
            fontWeight: '500', 
            fontFamily: 'Inter, sans-serif',
            color: '#4a5568'
          }}>
            Smart Tourist Safety Monitoring & Incident Response System
          </h2>
          
          {/* Description */}
          <p className="text-lg mb-12 max-w-3xl mx-auto leading-relaxed" style={{ 
            fontWeight: '400', 
            fontFamily: 'Inter, sans-serif',
            color: '#718096'
          }}>
            Revolutionizing tourist safety with blockchain-based digital IDs, real-time monitoring, and AI-powered emergency response across India's most beautiful destinations.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
              style={{ 
                backgroundColor: '#3182ce', 
                borderColor: '#3182ce',
                fontFamily: 'Inter, sans-serif', 
                fontWeight: '500'
              }}
              onClick={() => setCurrentView('tourist')}
            >
              📱 Start Your Journey
            </Button>
            
            <Button 
              className="px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
              style={{ 
                backgroundColor: '#4CAF93', 
                borderColor: '#4CAF93',
                fontFamily: 'Inter, sans-serif', 
                fontWeight: '500'
              }}
              onClick={() => setCurrentView('authority')}
            >
              📊 Authorities Dashboard
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}