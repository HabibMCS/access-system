import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Schedule {
  days: string[];
  startTime: string;
  endTime: string;
}

interface TemporaryAccess {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

interface Door {
  deviceId: string;
  name: string;
}

type AccessMethod = 'nfc' | 'virtualKeypad' | 'key';

interface UserConfig {
  name: string;
  roles: {
    installer: boolean;
    admin: boolean;
    passKeyHolder: boolean;
  };
  accessType: {
    permanent: boolean;
    scheduled: boolean;
    temporary: boolean;
  };
  tokenTypes: {
    nfc: boolean;
    virtualKeypad: boolean;
    nfcFobCard: boolean;
  };
  doorPermissions: {
    frontDoor: boolean;
    door2: boolean;
    door3: boolean;
    frontGate: boolean;
  };
  selectedDoors: { [key: string]: boolean };
  selectedMethods: { [key: string]: AccessMethod | '' };
  nfcData: { [key: string]: string };
  schedule: Schedule | null;
  temporaryAccess: TemporaryAccess | null;
}

const AddNewUser = () => {
  const [doors, setDoors] = useState<Door[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  const [userConfig, setUserConfig] = useState<UserConfig>({
    name: '',
    roles: {
      installer: false,
      admin: false,
      passKeyHolder: false
    },
    accessType: {
      permanent: false,
      scheduled: false,
      temporary: false
    },
    tokenTypes: {
      nfc: false,
      virtualKeypad: false,
      nfcFobCard: false
    },
    doorPermissions: {
      frontDoor: false,
      door2: false,
      door3: false,
      frontGate: false
    },
    selectedDoors: {},
    selectedMethods: {},
    nfcData: {},
    schedule: null,
    temporaryAccess: null
  });

  const accessMethods: { [key in AccessMethod]: string } = {
    nfc: 'NFC Card/Tag',
    virtualKeypad: 'Virtual Keypad',
    key: 'Physical Key'
  };

  useEffect(() => {
    fetchDoors();
  }, []);

  const fetchDoors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doors');
      const data = await response.json();
      setDoors(data);
      // Initialize selectedDoors state
      const doorState = data.reduce((acc: { [key: string]: boolean }, door: Door) => {
        acc[door.deviceId] = false;
        return acc;
      }, {});
      const methodState = data.reduce((acc: { [key: string]: AccessMethod | '' }, door: Door) => {
        acc[door.deviceId] = '';
        return acc;
      }, {});
      setUserConfig(prev => ({ 
        ...prev, 
        selectedDoors: doorState,
        selectedMethods: methodState
      }));
    } catch (err) {
      setError('Failed to fetch doors');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (field: keyof UserConfig['roles']) => {
    setUserConfig(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [field]: !prev.roles[field]
      }
    }));
  };

  const handleAccessTypeChange = (field: keyof UserConfig['accessType']) => {
    setUserConfig(prev => {
      const newConfig = {
        ...prev,
        accessType: {
          ...prev.accessType,
          [field]: !prev.accessType[field]
        }
      };

      if (field === 'scheduled' && !prev.accessType.scheduled) {
        newConfig.schedule = {
          days: [],
          startTime: '',
          endTime: ''
        };
      } else if (field === 'scheduled' && prev.accessType.scheduled) {
        newConfig.schedule = null;
      }

      if (field === 'temporary' && !prev.accessType.temporary) {
        newConfig.temporaryAccess = {
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: ''
        };
      } else if (field === 'temporary' && prev.accessType.temporary) {
        newConfig.temporaryAccess = null;
      }

      return newConfig;
    });
  };

  const handleDoorSelect = (deviceId: string) => {
    setUserConfig(prev => ({
      ...prev,
      selectedDoors: {
        ...prev.selectedDoors,
        [deviceId]: !prev.selectedDoors[deviceId]
      },
      selectedMethods: {
        ...prev.selectedMethods,
        [deviceId]: prev.selectedDoors[deviceId] ? '' : prev.selectedMethods[deviceId]
      }
    }));
  };

  const handleMethodSelect = (deviceId: string, method: AccessMethod) => {
    setUserConfig(prev => ({
      ...prev,
      selectedMethods: {
        ...prev.selectedMethods,
        [deviceId]: method
      }
    }));

    if (method === 'nfc') {
      startNFCScan(deviceId);
    }
  };

  const startNFCScan = async (deviceId: string) => {
    setScanning(true);
    setCurrentDeviceId(deviceId);
    try {
      const response = await fetch('/api/scan-nfc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userConfig.name,
          deviceId
        })
      });
      
      const data = await response.json();
      setUserConfig(prev => ({
        ...prev,
        nfcData: {
          ...prev.nfcData,
          [deviceId]: data.nfcId
        }
      }));
    } catch (err) {
      setError('NFC scan failed');
    } finally {
      setScanning(false);
      setCurrentDeviceId('');
    }
  };

  const isFormValid = () => {
    return userConfig.name && 
           Object.values(userConfig.selectedDoors).some(selected => selected) &&
           Object.entries(userConfig.selectedDoors)
             .filter(([_, selected]) => selected)
             .every(([deviceId]) => userConfig.selectedMethods[deviceId] !== '');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add New User</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={userConfig.name}
            onChange={(e) => setUserConfig(prev => ({...prev, name: e.target.value}))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Roles Section */}
        <div>
          <h3 className="font-medium mb-2">Roles</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(userConfig.roles).map(([role, checked]) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleRoleChange(role as keyof UserConfig['roles'])}
                  className="rounded"
                />
                <span className="capitalize">{role.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Access Type Section */}
        <div>
          <h3 className="font-medium mb-2">Access Type</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(userConfig.accessType).map(([type, checked]) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAccessTypeChange(type as keyof UserConfig['accessType'])}
                  className="rounded"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Door Access Section */}
        <div>
          <h3 className="font-medium mb-2">Door Access</h3>
          {loading ? (
            <div>Loading doors...</div>
          ) : (
            <div className="space-y-4">
              {doors.map(door => (
                <div key={door.deviceId} className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={userConfig.selectedDoors[door.deviceId]}
                      onChange={() => handleDoorSelect(door.deviceId)}
                      className="rounded"
                    />
                    <span>{door.name}</span>
                  </label>
                  
                  {userConfig.selectedDoors[door.deviceId] && (
                    <div className="ml-6 space-y-2">
                      <p className="text-sm font-medium">Select Access Method:</p>
                      {(Object.entries(accessMethods) as [AccessMethod, string][]).map(([method, label]) => (
                        <label key={method} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`method-${door.deviceId}`}
                            checked={userConfig.selectedMethods[door.deviceId] === method}
                            onChange={() => handleMethodSelect(door.deviceId, method)}
                            className="rounded"
                          />
                          <span>{label}</span>
                          {method === 'nfc' && 
                           userConfig.selectedMethods[door.deviceId] === 'nfc' && (
                            <span className="ml-2">
                              {scanning && currentDeviceId === door.deviceId 
                                ? 'Scanning...' 
                                : userConfig.nfcData[door.deviceId] 
                                  ? `NFC ID: ${userConfig.nfcData[door.deviceId]}`
                                  : ''}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={() => console.log('User configuration:', userConfig)}
            disabled={!isFormValid()}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add User
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNewUser;