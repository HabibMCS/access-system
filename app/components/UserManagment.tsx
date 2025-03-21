import React, { useState, } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, UserPlus, Clock, DoorClosed, Settings, AlertCircle, Youtube } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
interface User {
  id: string;
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
  permissions: {
    frontDoor: boolean;
    door2: boolean;
    door3: boolean;
    frontGate: boolean;
  };
}

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

interface DeviceLog {
  id: string;
  type: 'access' | 'system' | 'error';
  description: string;
  timestamp: string;
  user?: string;
  device: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    roles: { installer: false, admin: true, passKeyHolder: true },
    accessType: { permanent: true, scheduled: false, temporary: false },
    tokenTypes: { nfc: true, virtualKeypad: true, nfcFobCard: false },
    permissions: { frontDoor: true, door2: true, door3: false, frontGate: true }
  },
  {
    id: '2',
    name: 'Jane Doe',
    roles: { installer: false, admin: false, passKeyHolder: true },
    accessType: { permanent: false, scheduled: true, temporary: false },
    tokenTypes: { nfc: true, virtualKeypad: false, nfcFobCard: false },
    permissions: { frontDoor: true, door2: false, door3: false, frontGate: false }
  },
];

const mockActivities: UserActivity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    action: 'Access Granted',
    location: 'Front Door',
    timestamp: '2024-03-10 09:15:23',
    status: 'success'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Doe',
    action: 'Invalid PIN',
    location: 'Door 2',
    timestamp: '2024-03-10 09:30:45',
    status: 'failed'
  },
];

const mockDeviceLogs: DeviceLog[] = [
  {
    id: '1',
    type: 'access',
    description: 'Door access granted',
    timestamp: '2024-03-10 09:15:23',
    user: 'John Doe',
    device: 'Front Door'
  },
  {
    id: '2',
    type: 'system',
    description: 'System startup',
    timestamp: '2024-03-10 09:00:00',
    device: 'Main Controller'
  },
  {
    id: '3',
    type: 'error',
    description: 'Communication error with reader',
    timestamp: '2024-03-10 09:45:00',
    device: 'NFC Reader 2'
  },
];

// Users List Component
const UsersList = ( { onNavigate }: {onNavigate: React.Dispatch<React.SetStateAction<string>>}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {push} = useRouter()
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Users</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 p-2 border rounded"
              />
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
              onClick={() => onNavigate("addUser")}
            >
              <UserPlus size={20} />
              Add New User
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(user.roles)
                      .filter(([_, value]) => value)
                      .map(([role]) => (
                        <span 
                          key={role}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                        >
                          {role}
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div className="flex gap-2">
                  {Object.entries(user.permissions)
                    .filter(([_, value]) => value)
                    .map(([door]) => (
                      <span 
                        key={door}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded"
                      >
                        {door.replace(/([A-Z])/g, ' $1')}
                      </span>
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// User Activities Component
const UserActivities = () => {
  const [dateFilter, setDateFilter] = useState('all');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Activities</CardTitle>
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map(activity => (
            <div 
              key={activity.id}
              className="p-4 border rounded flex items-center gap-4"
            >
              <div className={`p-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-100' : 
                activity.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {activity.status === 'success' ? <DoorClosed  className="h-5 w-5 text-green-600" /> :
                 activity.status === 'failed' ? <AlertCircle className="h-5 w-5 text-red-600" /> :
                 <Clock className="h-5 w-5 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{activity.userName}</span>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {activity.action} - {activity.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Device Logs Component
const DeviceLogs = () => {
  const [logFilter, setLogFilter] = useState('all');

  const getLogIcon = (type: DeviceLog['type']) => {
    switch (type) {
      case 'access':
        return <DoorClosed  className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getLogStyle = (type: DeviceLog['type']) => {
    switch (type) {
      case 'access':
        return 'bg-blue-100';
      case 'system':
        return 'bg-gray-100';
      case 'error':
        return 'bg-red-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Device Logs</CardTitle>
          <select 
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Logs</option>
            <option value="access">Access Logs</option>
            <option value="system">System Logs</option>
            <option value="error">Error Logs</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDeviceLogs
            .filter(log => logFilter === 'all' || log.type === logFilter)
            .map(log => (
              <div 
                key={log.id}
                className="p-4 border rounded flex items-center gap-4"
              >
                <div className={`p-2 rounded-full ${getLogStyle(log.type)}`}>
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.device}</span>
                    <span className="text-sm text-gray-500">{log.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {log.description}
                    {log.user && <span className="text-gray-500"> - {log.user}</span>}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component that combines all
const UserManagement = ({onNavigate}: {onNavigate: React.Dispatch<React.SetStateAction<string>>}) => {
  return (
    <div className="space-y-6 p-6">
      <UsersList onNavigate={onNavigate}/>
      {/* <div className="grid grid-cols-2 gap-6">
        <UserActivities />
        <DeviceLogs />
      </div> */}
    </div>
  );
};

export default UserManagement;