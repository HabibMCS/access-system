import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Schedule {
  days: string[];
  startTime?: string|undefined;
  endTime?: string| undefined;
  dateRange?: {
    startDate?: string|undefined;
    endDate?: string|undefined;
  };
}

interface TemporaryAccess {
  date: string;
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
  email: string;
  phoneNumber: string;
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
interface Device {
  deviceId: string;
  authorizedUsers: string[];
  name: string;
  status: string;
  createdAt?: string;
}
const AddNewUser = () => {
  const [doors, setDoors] = useState<Door[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [selecteddoor,setSelecteddoor] = useState<Door>({name:'',deviceId:''})
  const [showKeypad, setShowKeypad] = useState(false);
  const [pin, setPin] = useState("");
  const allowedKeys = ["A", "B", "C", "D", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const [userConfig, setUserConfig] = useState<UserConfig>({
    name: '',
    email: '',
    phoneNumber: '',
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
      const token = localStorage.getItem('authToken'); // Retrieve the token dynamically
  
      if (!token) {
        throw new Error('Authorization token is missing');
      }
      console.log(token);
      setLoading(true);
      console.log({NEXT_PUBLIC_NFC_DOORS_STRING: process.env.NEXT_PUBLIC_NFC_DOORS_STRING})
      console.log({NEXT_PUBLIC_NFC_SCAN_STRING: process.env.NEXT_PUBLIC_NFC_SCAN_STRING})
      console.log({NEXT_PUBLIC_NFC_ADD_STRING: process.env.NEXT_PUBLIC_NFC_ADD_STRING})

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NFC_DOORS_STRING}`,  
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
  
      const devices: Device[] = await response.json();
      const activeDoors = devices.filter(device => device.status === 'active');
      
      setDoors(activeDoors.map(device => ({
        deviceId: device.deviceId,
        name: device.name
      })));
  
      // Initialize selectedDoors state with all doors set to false
      const doorState = activeDoors.reduce((acc: { [key: string]: boolean }, device) => {
        acc[device.deviceId] = false;
        return acc;
      }, {});
      
      setUserConfig(prev => ({
        ...prev,
        selectedDoors: doorState,
        selectedMethods: Object.keys(doorState).reduce((acc: { [key: string]: AccessMethod | '' }, deviceId) => {
          acc[deviceId] = '';
          return acc;
        }, {})
      }));
  
    } catch (err) {
      setError('Failed to fetch doors');
      console.error('Error fetching doors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + key);
    }
  };

  // Function to delete last character
  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handlekeySubmit = () => {
    console.log("Entered PIN:", pin);
    setShowKeypad(false);
  };


  const handleAccessTypeChange = (field: keyof UserConfig['accessType']) => {
    setUserConfig(prev => {
      const newConfig = {
        ...prev,
        accessType: {
          permanent: false,
          scheduled: false,
          temporary: false,
          [field]: true
        },
        schedule: null,
        temporaryAccess: null
      };

      if (field === 'scheduled') {
        newConfig.schedule = null;
      } else if (field === 'temporary') {
        newConfig.temporaryAccess = null;
      }

      console.log({newConfig})

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

  const handleMethodSelect = (deviceId: string, doorname:string,method: AccessMethod) => {

    setSelecteddoor(prev => ({
      ...prev,
      name:doorname,
      deviceId: deviceId
    }));
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

  const addUserNFC = async (deviceId: string,doorName:string,nfcData:string) => {
    try {
     
        const token = localStorage.getItem('authToken'); // Retrieve the token dynamically
  
        if (!token) {
          throw new Error('Authorization token is missing');
        }
      const response = await fetch(`${process.env.NEXT_PUBLIC_NFC_ADD_STRING}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userConfig.name,
          deviceId,
          nfc_str:nfcData,
          doorname:doorName,
          virtualPin:pin
        })
      });
      
      const data = await response.json();
      if (data.statusCode=200){
        alert("User Added")
      }
    } catch (err) {
      setError('err');
    } finally {
    }
  };
  const startNFCScan = async (deviceId: string) => {
    setScanning(true);
    setCurrentDeviceId(deviceId);
    try {
     
        const token = localStorage.getItem('authToken'); // Retrieve the token dynamically
  
        if (!token) {
          throw new Error('Authorization token is missing');
        }
      const response = await fetch(`${process.env.NEXT_PUBLIC_NFC_SCAN_STRING}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={userConfig.email}
            onChange={(e) => setUserConfig(prev => ({...prev, email: e.target.value}))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={userConfig.phoneNumber}
            onChange={(e) => setUserConfig(prev => ({...prev, phoneNumber: e.target.value}))}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Access Type Section */}
        <div>
          <h3 className="font-medium mb-2">Access Type</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(userConfig.accessType).map(([type, checked]) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={checked}
                  name="accessType"
                  onChange={() => handleAccessTypeChange(type as keyof UserConfig['accessType'])}
                  className="rounded"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Scheduled Access Options */}
          {userConfig.accessType.scheduled && (
            <div className="mt-4 ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <div className="flex space-x-4">
                  <input
                    type="date"
                    value={userConfig.schedule?.dateRange?.startDate || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        dateRange: {
                          ...prev.schedule?.dateRange,
                          startDate: e.target.value
                        }
                      }
                    }))}
                    className="border rounded p-2"
                  />
                  <input
                    type="date"
                    value={userConfig.schedule?.dateRange?.endDate || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        dateRange: {
                          ...prev.schedule?.dateRange,
                          endDate: e.target.value
                        }
                      }
                    }))}
                    className="border rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Range</label>
                <div className="flex space-x-4">
                  <input
                    type="time"
                    value={userConfig.schedule?.startTime || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        startTime: e.target.value
                      }
                    }))}
                    className="border rounded p-2"
                  />
                  <input
                    type="time"
                    value={userConfig.schedule?.endTime || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        endTime: e.target.value
                      }
                    }))}
                    className="border rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Temporary Access Options */}
          {userConfig.accessType.temporary && (
            <div className="mt-4 ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={userConfig.temporaryAccess?.date || ''}
                  onChange={(e) => setUserConfig(prev => ({
                    ...prev,
                    temporaryAccess: {
                      ...prev.temporaryAccess!,
                      date: e.target.value
                    }
                  }))}
                  className="border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Range</label>
                <div className="flex space-x-4">
                  <input
                    type="time"
                    value={userConfig.temporaryAccess?.startTime || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      temporaryAccess: {
                        ...prev.temporaryAccess!,
                        startTime: e.target.value
                      }
                    }))}
                    className="border rounded p-2"
                  />
                  <input
                    type="time"
                    value={userConfig.temporaryAccess?.endTime || ''}
                    onChange={(e) => setUserConfig(prev => ({
                      ...prev,
                      temporaryAccess: {
                        ...prev.temporaryAccess!,
                        endTime: e.target.value
                      }
                    }))}
                    className="border rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}
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
                            onChange={() => handleMethodSelect(door.deviceId, door.name,method) }
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
                          {method === "virtualKeypad" &&
                              userConfig.selectedMethods[door.deviceId] === "virtualKeypad" && (
                                <>
                                  <button
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={() => setShowKeypad(true)}
                                  >
                                    Enter PIN
                                  </button>

                                  {showKeypad===true && (
                                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                                      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                        <h2 className="text-lg font-semibold mb-2">Enter 6-digit PIN</h2>

                                        <div className="mb-4 p-2 border text-lg">{pin || "______"}</div>

                                        {/* Keypad Buttons */}
                                        <div className="grid grid-cols-4 gap-2">
                                          {allowedKeys.map((key) => (
                                            <button
                                              key={key}
                                              className="px-4 py-2 bg-gray-200 rounded text-xl"
                                              onClick={() => handleKeyPress(key)}
                                            >
                                              {key}
                                            </button>
                                          ))}
                                        </div>

                                        {/* Delete & Submit */}
                                        <div className="mt-4 flex justify-between">
                                          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>
                                            Delete
                                          </button>
                                          <button
                                            className={`px-4 py-2 rounded ${pin.length === 6 ? "bg-green-500 text-white" : "bg-gray-300"}`}
                                            onClick={handlekeySubmit}
                                            disabled={pin.length !== 6}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}          </>
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
            onClick={() => addUserNFC(selecteddoor.deviceId,selecteddoor.name,userConfig.nfcData[selecteddoor.deviceId])}
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