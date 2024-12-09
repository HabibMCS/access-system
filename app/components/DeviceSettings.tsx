import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Wifi, Radio } from 'lucide-react';

interface Output {
  id: string;
  name: string;
  activationTime: number;
}

interface Input {
  id: string;
  name: string;
  type: 'NFC reader' | 'keypad';
  status: string;
}

interface WifiConfig {
  name: string;
  username: string;
  password: string;
}

interface DeviceConfig {
  status: 'online' | 'offline';
  outputs: Output[];
  inputs: Input[];
  wifi: WifiConfig;
}

const DeviceSettings = () => {
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig>({
    status: 'online',
    outputs: [
      { id: '1', name: 'front door', activationTime: 3 },
      { id: '2', name: 'door 2', activationTime: 3 },
      { id: '3', name: 'door 3', activationTime: 3 },
      { id: '4', name: 'Front Gate', activationTime: 5 }
    ],
    inputs: [
      { id: '1', name: 'NFC reader', type: 'NFC reader', status: 'Connected' },
      { id: '2', name: 'keypad', type: 'keypad', status: 'Connected' },
      { id: '3', name: 'NFC reader', type: 'NFC reader', status: 'Connected' },
      { id: '4', name: 'NFC reader', type: 'NFC reader', status: 'Connected' }
    ],
    wifi: {
      name: '',
      username: '',
      password: ''
    }
  });

  const handleOutputChange = (id: string, field: keyof Output, value: string | number) => {
    setDeviceConfig(prev => ({
      ...prev,
      outputs: prev.outputs.map(output => 
        output.id === id ? { ...output, [field]: value } : output
      )
    }));
  };

  const handleInputChange = (id: string, field: keyof Input, value: string) => {
    setDeviceConfig(prev => ({
      ...prev,
      inputs: prev.inputs.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    }));
  };

  const handleWifiChange = (field: keyof WifiConfig, value: string) => {
    setDeviceConfig(prev => ({
      ...prev,
      wifi: {
        ...prev.wifi,
        [field]: value
      }
    }));
  };

  const handleTestInput = (id: string) => {
    console.log(`Testing input ${id}`);
    // Here you would typically implement the actual test logic
  };

  const handleSearchReader = () => {
    console.log('Searching for Reader/Keypad');
    // Implement reader/keypad search functionality
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Device Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Status Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              deviceConfig.status === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="capitalize">{deviceConfig.status}</span>
          </div>
        </div>

        {/* Outputs Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Outputs</h3>
          <div className="space-y-4">
            {deviceConfig.outputs.map(output => (
              <div key={output.id} className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label htmlFor={`output-${output.id}`} className="font-medium">
                    {output.name}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id={`output-${output.id}`}
                    value={output.activationTime}
                    onChange={(e) => handleOutputChange(output.id, 'activationTime', parseInt(e.target.value))}
                    className="w-20 p-2 border rounded"
                    min="1"
                  />
                  <span className="text-sm text-gray-500">seconds</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inputs Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Inputs</h3>
          <div className="space-y-4">
            {deviceConfig.inputs.map(input => (
              <div key={input.id} className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-500" />
                  <span>{input.name}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    input.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {input.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTestInput(input.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Test
                  </button>
                  {input.id === '1' && (
                    <button
                      onClick={handleSearchReader}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      Search
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WiFi Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            WiFi Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={deviceConfig.wifi.name}
                onChange={(e) => handleWifiChange('name', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={deviceConfig.wifi.username}
                onChange={(e) => handleWifiChange('username', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={deviceConfig.wifi.password}
                onChange={(e) => handleWifiChange('password', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => console.log('Saving device configuration:', deviceConfig)}
          >
            Save Changes
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceSettings;