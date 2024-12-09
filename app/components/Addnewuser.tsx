import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  schedule: Schedule | null;
  temporaryAccess: TemporaryAccess | null;
}

const AddNewUser = () => {
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
    schedule: null,
    temporaryAccess: null
  });

  // Type-safe handlers for each category
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

      // Initialize schedule when scheduled is selected
      if (field === 'scheduled' && !prev.accessType.scheduled) {
        newConfig.schedule = {
          days: [],
          startTime: '',
          endTime: ''
        };
      } else if (field === 'scheduled' && prev.accessType.scheduled) {
        newConfig.schedule = null;
      }

      // Initialize temporary access when temporary is selected
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

  const handleTokenTypeChange = (field: keyof UserConfig['tokenTypes']) => {
    setUserConfig(prev => ({
      ...prev,
      tokenTypes: {
        ...prev.tokenTypes,
        [field]: !prev.tokenTypes[field]
      }
    }));
  };

  const handleDoorPermissionChange = (field: keyof UserConfig['doorPermissions']) => {
    setUserConfig(prev => ({
      ...prev,
      doorPermissions: {
        ...prev.doorPermissions,
        [field]: !prev.doorPermissions[field]
      }
    }));
  };

  const handleScheduleChange = (field: keyof Schedule, value: string | string[]) => {
    setUserConfig(prev => ({
      ...prev,
      schedule: prev.schedule ? {
        ...prev.schedule,
        [field]: value
      } : null
    }));
  };

  const handleTemporaryAccessChange = (field: keyof TemporaryAccess, value: string) => {
    setUserConfig(prev => ({
      ...prev,
      temporaryAccess: prev.temporaryAccess ? {
        ...prev.temporaryAccess,
        [field]: value
      } : null
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add New User</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={userConfig.name}
            onChange={(e) => setUserConfig(prev => ({ ...prev, name: e.target.value }))}
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
          <h3 className="font-medium mb-2">User Type</h3>
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

        {/* Schedule Section - Only shown when Scheduled is selected */}
        {userConfig.accessType.scheduled && userConfig.schedule && (
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Schedule Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={userConfig.schedule?.days.includes(day)}
                      onChange={() => {
                        const days = userConfig.schedule?.days || [];
                        const newDays = days.includes(day) 
                          ? days.filter(d => d !== day)
                          : [...days, day];
                        handleScheduleChange('days', newDays);
                      }}
                      className="rounded"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Time</label>
                  <input
                    type="time"
                    value={userConfig.schedule.startTime}
                    onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Time</label>
                  <input
                    type="time"
                    value={userConfig.schedule.endTime}
                    onChange={(e) => handleScheduleChange('endTime', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Temporary Access Section - Only shown when Temporary is selected */}
        {userConfig.accessType.temporary && userConfig.temporaryAccess && (
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Temporary Access Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  value={userConfig.temporaryAccess.startDate}
                  onChange={(e) => handleTemporaryAccessChange('startDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  value={userConfig.temporaryAccess.endDate}
                  onChange={(e) => handleTemporaryAccessChange('endDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="time"
                  value={userConfig.temporaryAccess.startTime}
                  onChange={(e) => handleTemporaryAccessChange('startTime', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="time"
                  value={userConfig.temporaryAccess.endTime}
                  onChange={(e) => handleTemporaryAccessChange('endTime', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Token Types Section */}
        <div>
          <h3 className="font-medium mb-2">Token Types</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(userConfig.tokenTypes).map(([type, checked]) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleTokenTypeChange(type as keyof UserConfig['tokenTypes'])}
                  className="rounded"
                />
                <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Door Permissions Section */}
        <div>
          <h3 className="font-medium mb-2">Permissions</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(userConfig.doorPermissions).map(([door, checked]) => (
              <label key={door} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleDoorPermissionChange(door as keyof UserConfig['doorPermissions'])}
                  className="rounded"
                />
                <span className="capitalize">{door.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={() => console.log('User configuration:', userConfig)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNewUser;