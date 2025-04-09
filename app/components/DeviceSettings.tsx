"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Bell, Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface TimeZone {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationSetting {
  id: string;
  event: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const DeviceSettings: React.FC = () => {
  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('idToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  };

  // Mock data for time zones
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    {
      id: '1',
      name: 'Business Hours',
      startTime: '09:00',
      endTime: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '2',
      name: 'Weekend Access',
      startTime: '10:00',
      endTime: '16:00',
      days: ['Saturday', 'Sunday']
    }
  ]);

  // Mock data for security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      name: 'Anti-Passback',
      description: 'Prevents the same credential from being used twice in succession without a valid exit',
      enabled: true
    },
    {
      id: '2',
      name: 'Duress Detection',
      description: 'Detects when a user is forced to grant access under duress',
      enabled: false
    },
    {
      id: '3',
      name: 'Failed Attempts Lockout',
      description: 'Temporarily lock access after multiple failed attempts',
      enabled: true
    }
  ]);

  // Mock data for notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      event: 'Unauthorized Access Attempt',
      email: true,
      push: true,
      sms: false
    },
    {
      id: '2',
      event: 'Door Left Open',
      email: true,
      push: true,
      sms: true
    },
    {
      id: '3',
      event: 'System Offline',
      email: true,
      push: true,
      sms: true
    }
  ]);

  // State for new time zone form
  const [newTimeZone, setNewTimeZone] = useState<Omit<TimeZone, 'id'>>({
    name: '',
    startTime: '09:00',
    endTime: '17:00',
    days: []
  });

  // Toggle security setting
  const toggleSecuritySetting = (id: string) => {
    // In a real implementation, you would make an API call with auth headers
    setSecuritySettings(
      securitySettings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  // Toggle notification method
  const toggleNotification = (id: string, method: 'email' | 'push' | 'sms') => {
    // In a real implementation, you would make an API call with auth headers
    setNotificationSettings(
      notificationSettings.map(setting => 
        setting.id === id ? { ...setting, [method]: !setting[method] } : setting
      )
    );
  };

  // Handle day selection for new time zone
  const handleDayToggle = (day: string) => {
    if (newTimeZone.days.includes(day)) {
      setNewTimeZone({
        ...newTimeZone,
        days: newTimeZone.days.filter(d => d !== day)
      });
    } else {
      setNewTimeZone({
        ...newTimeZone,
        days: [...newTimeZone.days, day]
      });
    }
  };

  // Add new time zone
  const addTimeZone = () => {
    // In a real implementation, you would make an API call with auth headers
    if (newTimeZone.name && newTimeZone.days.length > 0) {
      setTimeZones([
        ...timeZones,
        {
          id: Date.now().toString(),
          ...newTimeZone
        }
      ]);
      setNewTimeZone({
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        days: []
      });
    }
  };

  // Delete time zone
  const deleteTimeZone = (id: string) => {
    // In a real implementation, you would make an API call with auth headers
    setTimeZones(timeZones.filter(zone => zone.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Device Settings</h1>
      
      {/* Time Zones Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Access Time Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeZones.map(zone => (
              <div key={zone.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{zone.name}</h3>
                  <p className="text-sm text-gray-600">
                    {zone.startTime} - {zone.endTime} | {zone.days.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => deleteTimeZone(zone.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
            
            {/* Add New Time Zone Form */}
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Add New Time Zone</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newTimeZone.name}
                    onChange={(e) => setNewTimeZone({ ...newTimeZone, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newTimeZone.startTime}
                      onChange={(e) => setNewTimeZone({ ...newTimeZone, startTime: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      value={newTimeZone.endTime}
                      onChange={(e) => setNewTimeZone({ ...newTimeZone, endTime: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1 rounded text-sm ${
                          newTimeZone.days.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={addTimeZone}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Time Zone
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Security Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securitySettings.map(setting => (
              <div key={setting.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{setting.name}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSecuritySetting(setting.id)}
                  className={`p-2 rounded-full ${
                    setting.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {setting.enabled ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationSettings.map(setting => (
              <div key={setting.id} className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  <h3 className="font-medium">{setting.event}</h3>
                </div>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.email}
                      onChange={() => toggleNotification(setting.id, 'email')}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.push}
                      onChange={() => toggleNotification(setting.id, 'push')}
                      className="mr-2"
                    />
                    Push
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.sms}
                      onChange={() => toggleNotification(setting.id, 'sms')}
                      className="mr-2"
                    />
                    SMS
                  </label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSettings;
