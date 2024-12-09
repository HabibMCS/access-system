"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Plus, AlertCircle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DevicePermissions {
  cardAccess: boolean;
  pinAccess: boolean;
  biometric: boolean;
  scheduling: boolean;
}

interface DeviceFeatures {
  antiPassback: boolean;
  timeZones: boolean;
  visitorManagement: boolean;
}

interface DeviceEvent {
  id: number;
  timestamp: string;
  type: string;
  user: string;
  details: string;
}

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  permissions: DevicePermissions;
  features: DeviceFeatures;
  events: DeviceEvent[];
}

interface NewDevice {
  name: string;
  type: string;
  permissions: DevicePermissions;
  features: DeviceFeatures;
}

// Mock data
const mockDevices: Device[] = [
  {
    id: 1,
    name: "Main Entrance",
    type: "Access Control",
    status: "Online",
    permissions: {
      cardAccess: true,
      pinAccess: true,
      biometric: false,
      scheduling: true
    },
    features: {
      antiPassback: true,
      timeZones: true,
      visitorManagement: false
    },
    events: [
      { id: 1, timestamp: "2024-03-06 09:15:23", type: "Access Granted", user: "John Doe", details: "Card Access" },
      { id: 2, timestamp: "2024-03-06 09:30:45", type: "Invalid PIN", user: "Unknown", details: "Failed Attempt" },
      { id: 3, timestamp: "2024-03-06 10:00:00", type: "Door Held Open", user: "System", details: "Warning" }
    ]
  },
  {
    id: 2,
    name: "Server Room",
    type: "Security Zone",
    status: "Online",
    permissions: {
      cardAccess: true,
      pinAccess: true,
      biometric: true,
      scheduling: true
    },
    features: {
      antiPassback: true,
      timeZones: true,
      visitorManagement: true
    },
    events: [
      { id: 1, timestamp: "2024-03-06 08:00:00", type: "Access Granted", user: "Admin", details: "Biometric" },
      { id: 2, timestamp: "2024-03-06 08:45:12", type: "System Check", user: "System", details: "Routine" }
    ]
  }
];

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [showAddDevice, setShowAddDevice] = useState<boolean>(false);
  const [newDevice, setNewDevice] = useState<NewDevice>({
    name: '',
    type: 'Access Control',
    permissions: {
      cardAccess: false,
      pinAccess: false,
      biometric: false,
      scheduling: false
    },
    features: {
      antiPassback: false,
      timeZones: false,
      visitorManagement: false
    }
  });

  // Mock API calls
  const fetchDevices = async (): Promise<Device[]> => {
    return mockDevices;
  };

  const addNewDevice = async (device: NewDevice): Promise<void> => {
    const newId = devices.length + 1;
    const newDeviceWithId: Device = {
      ...device,
      id: newId,
      status: 'Online',
      events: []
    };
    setDevices([...devices, newDeviceWithId]);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handlePermissionChange = (deviceId: number, permission: keyof DevicePermissions): void => {
    const updatedDevices = devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          permissions: {
            ...device.permissions,
            [permission]: !device.permissions[permission]
          }
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleFeatureToggle = (deviceId: number, feature: keyof DeviceFeatures): void => {
    const updatedDevices = devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          features: {
            ...device.features,
            [feature]: !device.features[feature]
          }
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleAddDevice = (): void => {
    addNewDevice(newDevice);
    setShowAddDevice(false);
    setNewDevice({
      name: '',
      type: 'Access Control',
      permissions: {
        cardAccess: false,
        pinAccess: false,
        biometric: false,
        scheduling: false
      },
      features: {
        antiPassback: false,
        timeZones: false,
        visitorManagement: false
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Device Management</h2>
        <button
          onClick={() => setShowAddDevice(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Relay
        </button>
      </div>

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Add New Device</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Device Name</label>
                  <input
                    type="text"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newDevice.type}
                    onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option>Access Control</option>
                    <option>Security Zone</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddDevice}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Device
                  </button>
                  <button
                    onClick={() => setShowAddDevice(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Device List */}
      <div className="grid gap-6">
        {devices.map(device => (
          <Card key={device.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{device.name}</h3>
                <p className="text-gray-500">{device.type}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                device.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {device.status}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Permissions</h4>
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(device.permissions) as [keyof DevicePermissions, boolean][]).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handlePermissionChange(device.id, key)}
                      className="w-4 h-4"
                    />
                    <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Features</h4>
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(device.features) as [keyof DeviceFeatures, boolean][]).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleFeatureToggle(device.id, key)}
                      className="w-4 h-4"
                    />
                    <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Section */}
            <div>
              <h4 className="text-lg font-medium mb-2">Recent Events</h4>
              <div className="space-y-2">
                {device.events.map(event => (
                  <div key={event.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={`p-1 rounded ${
                      event.type.includes('Granted') ? 'bg-green-100' :
                      event.type.includes('Invalid') ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {event.type.includes('Granted') ? <Info size={16} /> :
                       event.type.includes('Invalid') ? <AlertCircle size={16} /> :
                       <Settings size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{event.type}</span>
                        <span className="text-sm text-gray-500">{event.timestamp}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.user} - {event.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeviceManagement;