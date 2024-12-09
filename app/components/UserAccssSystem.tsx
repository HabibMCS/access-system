"use client";

import React, { useState } from 'react';
import { Layout, User, UserPlus, Activity, Settings, Menu, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DeviceManagement from './DeviceManagement';
import AddNewUser from './Addnewuser';
import DeviceSettings from './DeviceSettings';
import UserManagement from './UserManagment';
import Homepage from './HomePage';

const UserAccessSystem: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pin, setPin] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          setCurrentPage('home');
        }
      }
    };

    return (
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto mt-4">
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

  // Navigation items
  const navigationItems = [
    { icon: <Layout size={20} />, label: 'Users', page: 'users' },
    { icon: <Settings size={20} />, label: 'Device Management', page: 'devices' },
    { icon: <UserPlus size={20} />, label: 'Add New User', page: 'addUser' },
    { icon: <Activity size={20} />, label: 'Device Settings', page: 'deviceSettings' }
  ];

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <h1 
            className="text-2xl font-bold text-center mb-6 cursor-pointer hover:text-blue-600"
            onClick={() => {
              setAuthenticated(true);
              setCurrentPage('home');
            }}
          >
            KEYFLOW
          </h1>
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
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Mobile Menu Button */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">K E Y F L O W</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'}
        sm:block
        w-full sm:w-64 bg-gray-800 text-white
        ${isMobileMenuOpen ? 'absolute inset-x-0 z-50' : 'relative'}
      `}>
        <div className="hidden sm:block p-4">
        <h1 
            className="text-2xl font-bold mb-6 cursor-pointer hover:text-blue-600"
            onClick={() => setCurrentPage('home')}
          >
            KEYFLOW
          </h1>
        </div>
        <nav className="mt-4">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-4 flex items-center gap-2 ${
                currentPage === item.page ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          {currentPage === 'home' && <Homepage onNavigate={setCurrentPage} />}
          {currentPage === 'users' && <UserManagement />}
          {currentPage === 'devices' && <DeviceManagement />}
          {currentPage === 'addUser' && <AddNewUser />}
          {currentPage === 'deviceSettings' && <DeviceSettings />}
        </div>
      </div>
    </div>
  );
};

export default UserAccessSystem;