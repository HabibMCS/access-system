"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, Key, Calendar, DoorClosed, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker'; // Install via: npm install react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

interface Device {
  deviceId: string;
  deviceName: string;
  status: string;
  doors: Record<string, Door>;
}

interface Door {
  assignees: Assignee[];
}

interface Assignee {
  assigneeName: string;
  nfcId: string;
  virtualPin: string;
  role: string;
  accessType: string;
}

interface AddnewuserProps {
  userId: string;
}

const Addnewuser: React.FC<AddnewuserProps> = ({ userId }) => {
  const [devices, setDevices] = useState<Record<string, Device>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Form states
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedDoor, setSelectedDoor] = useState<string>('');
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [nfcId, setNfcId] = useState<string>('');
  const [virtualPin, setVirtualPin] = useState<string>('');
  const [role, setRole] = useState<string>('user');
  // For date range selection: an array holding [startDate, endDate]
  const [accessType, setAccessType] = useState('permanent');

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  // Time range states with explicit typing
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isNfcScanning, setIsNfcScanning] = useState<boolean>(false);
  const [newDoorName, setNewDoorName] = useState<string>('');
  const [showAddDoor, setShowAddDoor] = useState<boolean>(false);
  const [showAddDevice, setShowAddDevice] = useState<boolean>(false);
  const [newDeviceName, setNewDeviceName] = useState<string>('');

  const baseUrl = 'https://sxera9zsa1.execute-api.ap-southeast-2.amazonaws.com/dev';

  useEffect(() => {
    fetchDevices();
  }, [userId]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('idToken');
    console.log(accessToken);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  };

  const fetchDevices = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/device/get_devices`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDevices(data);
      } else {
        setError(data.error || 'Failed to fetch devices');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    setError('');
    setSuccess('');
    
    if (!newDeviceName.trim()) {
      setError('Device name is required');
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/device/add_device`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          deviceName: newDeviceName,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Device added successfully');
        setNewDeviceName('');
        setShowAddDevice(false);
        fetchDevices();
      } else {
        setError(data.error || 'Failed to add device');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleAddDoor = async () => {
    setError('');
    setSuccess('');
    
    if (!selectedDevice) {
      setError('Please select a device first');
      return;
    }
    
    if (!newDoorName.trim()) {
      setError('Door name is required');
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/device/add_door`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          deviceId: selectedDevice,
          doorName: newDoorName,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Door added successfully');
        setNewDoorName('');
        setShowAddDoor(false);
        fetchDevices();
      } else {
        setError(data.error || 'Failed to add door');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const startNfcScan = async () => {
    setError('');
    setIsNfcScanning(true);
    
    try {
      const response = await fetch(`${baseUrl}/scan-nfc`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          deviceId: selectedDevice,
          username: assigneeName || 'New User',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.nfcId) {
        setNfcId(data.nfcId);
      } else {
        setError(data.error || 'Failed to scan NFC');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsNfcScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedDevice || !selectedDoor || !assigneeName) {
      setError('Device, door, and assignee name are required');
      return;
    }
    
    if (!nfcId && !virtualPin) {
      setError('Either NFC ID or Virtual PIN is required');
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/device/add_assignee`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          deviceId: selectedDevice,
          doorName: selectedDoor,
          assigneeName,
          nfcId,
          virtualPin,
          role,
          accessType,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('User added successfully');
        // Reset form
        setAssigneeName('');
        setNfcId('');
        setVirtualPin('');
        setRole('user');
        setAccessType('permanent');
        fetchDevices();
      } else {
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const getDeviceOptions = () => {
    return Object.entries(devices).map(([deviceId, device]) => (
      <option key={deviceId} value={deviceId}>
        {device.deviceName}
      </option>
    ));
  };

  const getDoorOptions = () => {
    if (!selectedDevice || !devices[selectedDevice]?.doors) return [];
    
    return Object.keys(devices[selectedDevice].doors).map(doorName => (
      <option key={doorName} value={doorName}>
        {doorName}
      </option>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User & Access Management</h1>
      
      {/* Add Device Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DoorClosed className="mr-2 h-5 w-5" />
            Device Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading devices...</p>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Your Devices</h3>
                <button
                  onClick={() => setShowAddDevice(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Device
                </button>
              </div>
              
              {Object.keys(devices).length === 0 ? (
                <p className="text-gray-500">No devices found. Add your first device.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(devices).map(([deviceId, device]) => (
                    <div key={deviceId} className="border p-4 rounded-lg">
                      <h4 className="font-medium">{device.deviceName}</h4>
                      <p className="text-sm text-gray-500">ID: {deviceId}</p>
                      <div className="mt-2">
                        <p className="text-sm">
                          Doors: {Object.keys(device.doors || {}).length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Device Modal */}
              {showAddDevice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="text-lg font-medium mb-4">Add New Device</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Device Name</label>
                      <input
                        type="text"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 text-red-800 rounded flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        {error}
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowAddDevice(false);
                          setError('');
                        }}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddDevice}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add Device
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Add Door Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DoorClosed className="mr-2 h-5 w-5" />
            Door Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Manage Doors</h3>
            <button
              onClick={() => setShowAddDoor(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={Object.keys(devices).length === 0}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Door
            </button>
          </div>
          
          {/* Add Door Modal */}
          {showAddDoor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-medium mb-4">Add New Door</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Device</label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a device</option>
                    {getDeviceOptions()}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Door Name</label>
                  <input
                    type="text"
                    value={newDoorName}
                    onChange={(e) => setNewDoorName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-800 rounded flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {error}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddDoor(false);
                      setError('');
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDoor}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Door
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-800 rounded flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Device</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a device</option>
                  {getDeviceOptions()}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Door</label>
                <select
                  value={selectedDoor}
                  onChange={(e) => setSelectedDoor(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!selectedDevice}
                >
                  <option value="">Select a door</option>
                  {getDoorOptions()}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Name</label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">NFC ID</label>
                <div className="flex">
                  <input
                    type="text"
                    value={nfcId}
                    onChange={(e) => setNfcId(e.target.value)}
                    className="flex-1 p-2 border rounded-l"
                    placeholder="Scan or enter manually"
                  />
                  <button
                    type="button"
                    onClick={startNfcScan}
                    disabled={!selectedDevice || isNfcScanning}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    {isNfcScanning ? 'Scanning...' : 'Scan'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Either NFC ID or Virtual PIN is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Virtual PIN</label>
                <input
                  type="text"
                  value={virtualPin}
                  onChange={(e) => setVirtualPin(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  pattern="[0-9]*"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              
              <div className="space-y-4">
      {/* Access Type Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Access Type</label>
        <select
          value={accessType}
          onChange={(e) => setAccessType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="permanent">Permanent</option>
          <option value="scheduled">Scheduled</option>
          <option value="temporary">Temporary</option>
        </select>
      </div>

      {(accessType === 'scheduled' || accessType === 'temporary') && (
        <div className="space-y-4">
          {/* Date Range Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Date Range</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Click to select a date range"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Time Range</label>
            <div className="flex items-center space-x-2">
              <DatePicker
                selected={startTime}
                onChange={(time: Date | null) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Start Time"
                dateFormat="h:mm aa"
                placeholderText="Start Time"
                className="p-2 border rounded"
              />
              <span>to</span>
              <DatePicker
                selected={endTime}
                onChange={(time: Date | null) => setEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="End Time"
                dateFormat="h:mm aa"
                placeholderText="End Time"
                className="p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>

              </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            >
              <Key className="mr-2 h-4 w-4" />
              Add User Access
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Addnewuser;
