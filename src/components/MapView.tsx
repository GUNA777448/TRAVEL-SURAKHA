import React from 'react';
import { MapPin, Users } from 'lucide-react';

interface MapViewProps {
  userLocation: { lat: number; lng: number };
  userZone: string;
  companions?: Array<{
    name: string;
    zone: string;
    distance: string;
  }>;
}

export function MapView({ userLocation, userZone, companions = [] }: MapViewProps) {
  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'safe': return '#7ED957';
      case 'caution': return '#FFC857';
      case 'danger': return '#FF5A5F';
      default: return '#4A90E2';
    }
  };

  // Mock map zones - simplified representation
  const zones = [
    { 
      name: 'Tourist Hub', 
      zone: 'safe', 
      x: 20, 
      y: 30, 
      width: 40, 
      height: 25 
    },
    { 
      name: 'Market Area', 
      zone: 'caution', 
      x: 65, 
      y: 15, 
      width: 30, 
      height: 35 
    },
    { 
      name: 'Construction Zone', 
      zone: 'danger', 
      x: 15, 
      y: 65, 
      width: 35, 
      height: 20 
    },
  ];

  // Calculate user position on mock map
  const userX = 50 + (userLocation.lng - 77.5946) * 1000;
  const userY = 50 + (userLocation.lat - 12.9716) * 1000;

  return (
    <div className="space-y-4">
      {/* Mock Map */}
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Zones */}
        {zones.map((zone, index) => (
          <div
            key={index}
            className="absolute rounded opacity-30"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
              backgroundColor: getZoneColor(zone.zone),
            }}
          />
        ))}

        {/* Zone labels */}
        {zones.map((zone, index) => (
          <div
            key={`label-${index}`}
            className="absolute text-xs p-1 rounded text-white"
            style={{
              left: `${zone.x + 2}%`,
              top: `${zone.y + 2}%`,
              backgroundColor: getZoneColor(zone.zone),
            }}
          >
            {zone.name}
          </div>
        ))}

        {/* User location */}
        <div
          className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${Math.max(10, Math.min(90, userX))}%`,
            top: `${Math.max(10, Math.min(90, userY))}%`,
          }}
        >
          <div className="relative">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: getZoneColor(userZone) }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              You
            </div>
          </div>
        </div>

        {/* Companions */}
        {companions.map((companion, index) => {
          const companionX = 50 + Math.random() * 40 - 20;
          const companionY = 50 + Math.random() * 40 - 20;
          
          return (
            <div
              key={companion.name}
              className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${companionX}%`,
                top: `${companionY}%`,
              }}
            >
              <div className="relative">
                <div 
                  className="w-4 h-4 rounded-full border border-white shadow"
                  style={{ backgroundColor: getZoneColor(companion.zone) }}
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                  {companion.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-around text-xs">
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#7ED957' }}
          ></div>
          <span>Safe Zone</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#FFC857' }}
          ></div>
          <span>Caution</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#FF5A5F' }}
          ></div>
          <span>Danger</span>
        </div>
      </div>

      {/* Coordinates */}
      <div className="text-xs text-center text-gray-500 p-2 bg-gray-50 rounded">
        GPS: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
      </div>
    </div>
  );
}