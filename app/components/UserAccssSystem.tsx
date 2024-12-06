"use client";

import React, { useState } from 'react';
import { Layout, User, UserPlus, Activity, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MockUser {
  id: number;
  name: string;
  pin: string;
  attendance: boolean;
  inTime: string | null;
  outTime: string | null;
}

interface UserDetails {
  id: number;
  name: string;
  pin: string;
  avgInTime: string;
  avgOutTime: string;
  absentDays: string[];
  recentActivity: {
    date: string;
    inTime: string;
    outTime: string;
  }[];
}

interface AdminData {
  name: string;
  id: string;
  users: MockUser[];
}

// Mock data for demonstration
const mockUsers: MockUser[] = [
  { id: 1, name: 'John Doe', pin: '1234', attendance: true, inTime: '09:00', outTime: '17:00' },
  { id: 2, name: 'Jane Smith', pin: '5678', attendance: true, inTime: '08:45', outTime: '16:30' },
  { id: 3, name: 'Mike Johnson', pin: '9012', attendance: false, inTime: null, outTime: null },
];

const mockUserDetails: UserDetails = {
  id: 1,
  name: 'John Doe',
  pin: '1234',
  avgInTime: '08:55',
  avgOutTime: '17:05',
  absentDays: ['2024-01-15', '2024-02-02'],
  recentActivity: [
    { date: '2024-03-01', inTime: '09:00', outTime: '17:00' },
    { date: '2024-03-02', inTime: '08:50', outTime: '16:45' },
  ]
};

const UserAccessSystem: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [pin, setPin] = useState<string>('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  // Keypad component
  const Keypad = () => {
    const numbers: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];
    
    const handleKeyPress = (key: string): void => {
      if (key === 'C') {
        setPin('');
      } else if (key === '⌫') {
        setPin(prev => prev.slice(0, -1));
      } else if (pin.length < 4) {
        const newPin = pin + key;
        setPin(newPin);
        if (newPin.length === 4) {
          setAuthenticated(true);
          setAdminData({
            name: 'Admin User',
            id: 'A001',
            users: mockUsers
          });
        }
      }
    };

    return (
      <div className="grid grid-cols-3 gap-4 w-64 mx-auto mt-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 text-xl transition-colors"
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  // Dashboard component
  const Dashboard = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid gap-6">
        {adminData?.users.map(user => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-500">ID: {user.id}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${user.attendance ? 'text-green-500' : 'text-red-500'}`}>
                  {user.attendance ? 'Present' : 'Absent'}
                </p>
                {user.attendance && (
                  <p className="text-sm text-gray-500">
                    {user.inTime} - {user.outTime}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // User Activity component
  const UserActivity = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Activity</h2>
      <div className="grid gap-6">
        {!selectedUser ? (
          adminData?.users.map(user => (
            <Card
              key={user.id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedUser(mockUserDetails)}
            >
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-500">Click to view details</p>
            </Card>
          ))
        ) : (
          <div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-4 text-blue-500 hover:text-blue-600"
            >
              ← Back to users
            </button>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedUser.name}</h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-gray-500">Average Arrival Time</p>
                  <p className="text-lg font-medium">{selectedUser.avgInTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Average Departure Time</p>
                  <p className="text-lg font-medium">{selectedUser.avgOutTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Absent Days</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedUser.absentDays.map(day => (
                      <span key={day} className="bg-red-100 text-red-800 px-2 py-1 rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-2">Recent Activity</p>
                  {selectedUser.recentActivity.map(activity => (
                    <div key={activity.date} className="flex justify-between border-b py-2">
                      <span>{activity.date}</span>
                      <span>{activity.inTime} - {activity.outTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  // Register User component
  const RegisterUser = () => {
    const [newUserPin, setNewUserPin] = useState<string>('');
    const [newUserName, setNewUserName] = useState<string>('');

    const handleRegister = (): void => {
      alert(`Registered user ${newUserName} with PIN ${newUserPin}`);
      setNewUserName('');
      setNewUserPin('');
    };

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Register New User</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                type="password"
                value={newUserPin}
                onChange={(e) => setNewUserPin(e.target.value)}
                maxLength={4}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Register User
            </button>
          </div>
        </Card>
      </div>
    );
  };

  // Profile component
  const Profile = () => {
    const [adminName, setAdminName] = useState<string>('Admin User');
    const [adminPin, setAdminPin] = useState<string>('****');

    const handleUpdateProfile = (): void => {
      alert('Profile updated successfully');
    };

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        </Card>
      </div>
    );
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    pin.length > i ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <Keypad />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Access System</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full p-4 flex items-center gap-2 ${
              currentPage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Layout size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('activity')}
            className={`w-full p-4 flex items-center gap-2 ${
              currentPage === 'activity' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Activity size={20} />
            User Activity
          </button>
          <button
            onClick={() => setCurrentPage('register')}
            className={`w-full p-4 flex items-center gap-2 ${
              currentPage === 'register' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <UserPlus size={20} />
            Register User
          </button>
          <button
            onClick={() => setCurrentPage('profile')}
            className={`w-full p-4 flex items-center gap-2 ${
              currentPage === 'profile' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <User size={20} />
            Profile
          </button>
          <button
            onClick={() => setCurrentPage('devices')}
            className={`w-full p-4 flex items-center gap-2 ${
              currentPage === 'devices' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Settings size={20} />
            Devices
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'activity' && <UserActivity />}
        {currentPage === 'register' && <RegisterUser />}
        {currentPage === 'profile' && <Profile />}
      </div>
    </div>
  );
};

export default UserAccessSystem;