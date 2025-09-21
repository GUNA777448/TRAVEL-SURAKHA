import React, { useState } from 'react';
import { Tourist } from './TouristApp';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SanitationReportProps {
  user: Tourist;
}

export function SanitationReport({ user }: SanitationReportProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReports, setRecentReports] = useState<Array<{
    id: string;
    description: string;
    timestamp: Date;
    status: 'pending' | 'acknowledged' | 'resolved';
  }>>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !description.trim()) {
      toast.error('Please add both a photo and description');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReport = {
      id: `report-${Date.now()}`,
      description: description.trim(),
      timestamp: new Date(),
      status: 'pending' as const
    };

    setRecentReports(prev => [newReport, ...prev]);
    
    toast.success('🧽 Sanitation Report Submitted!', {
      description: 'Cleaning request has been sent to authorities.',
      duration: 4000,
    });

    // Reset form
    setSelectedImage(null);
    setDescription('');
    setIsSubmitting(false);

    // Simulate status updates
    setTimeout(() => {
      setRecentReports(prev => 
        prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'acknowledged' }
            : report
        )
      );
      toast.info('Report acknowledged by authorities');
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" style={{ color: '#4A90E2' }} />
            Report Sanitation Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Upload */}
          <div>
            <Label>Upload Photo</Label>
            <div className="mt-2">
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Sanitation issue" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click to upload photo
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the sanitation issue (e.g., dirty restrooms, overflowing trash, broken facilities...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Location Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Reporter:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="text-xs">
                  {user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="text-xs">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting || !selectedImage || !description.trim()}
            style={{ backgroundColor: '#4A90E2' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {report.status === 'pending' && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                      {report.status === 'acknowledged' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {report.status === 'resolved' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm capitalize">{report.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {report.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{report.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}