import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DoorClosed, 
  Users, 
  Shield, 
  Clock, 
  Activity, 
  Settings, 
  Key,
  Bell,
  UserPlus
} from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

interface RecentActivity {
  id: string;
  type: 'access' | 'system' | 'alert';
  description: string;
  time: string;
}

const Homepage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [showNotification, setShowNotification] = useState(false);

  const quickActions: QuickAction[] = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Manage Users",
      description: "Add, edit, or remove user access",
      onClick: () => onNavigate('users')
    },
    {
      icon: <DoorClosed className="w-8 h-8 text-green-500" />,
      title: "Door Control",
      description: "Monitor and control access points",
      onClick: () => onNavigate('devices')
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Security Settings",
      description: "Configure system security",
      onClick: () => onNavigate('deviceSettings')
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "Access Schedules",
      description: "Set up access time slots",
      onClick: () => onNavigate('addUser')
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'access',
      description: 'John Doe accessed Front Door',
      time: '2 minutes ago'
    },
    {
      id: '2',
      type: 'system',
      description: 'System backup completed',
      time: '15 minutes ago'
    },
    {
      id: '3',
      type: 'alert',
      description: 'Multiple failed access attempts',
      time: '1 hour ago'
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'access':
        return <Key className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      case 'alert':
        return <Bell className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to KEYFLOW
        </h1>
        <p className="text-lg text-gray-600">
          Secure Access Management System
        </p>
      </div>

      {/* System Status Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">4</div>
              <div className="text-sm text-gray-600">Active Doors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">24</div>
              <div className="text-sm text-gray-600">Today's Accesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">0</div>
              <div className="text-sm text-gray-600">Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={action.onClick}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {action.icon}
                <h3 className="mt-4 font-semibold">{action.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="p-2 bg-gray-100 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Button for Quick Add */}
      <button 
        className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => onNavigate('addUser')}
      >
        <UserPlus className="w-6 h-6" />
      </button>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium">New Activity</p>
            <p className="text-sm text-gray-600">Door access granted: Main Entrance</p>
          </div>
          <button 
            className="ml-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowNotification(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Homepage;
