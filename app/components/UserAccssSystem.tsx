"use client";

import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import UserManagement from './UserManagment';
import DeviceManagement from './DeviceManagement';
import DeviceSettings from './DeviceSettings';
import Addnewuser from './Addnewuser';

const UserAccessSystem: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);

  const baseUrl = 'https://sxera9zsa1.execute-api.ap-southeast-2.amazonaws.com/dev';

  useEffect(() => {
    // Check if user is already logged in
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsLoggedIn(true);
        setUserId(data.user_id);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('accessToken', data.tokens.AccessToken);
        localStorage.setItem('idToken', data.tokens.IdToken);
        localStorage.setItem('refreshToken', data.tokens.RefreshToken);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNeedsVerification(true);
        setUserId(data.userId);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNeedsVerification(false);
        setIsSignUp(false);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleResendCode = async () => {
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Verification code resent to your email');
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    setCurrentPage('home');
  };

  const renderAuthForm = () => {
    if (needsVerification) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
            <form onSubmit={handleVerification}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Resend Code
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Login to KEYFLOW'}
          </h2>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            {/* <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button> */}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return renderAuthForm();
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'users':
        return <UserManagement onNavigate={setCurrentPage} />;
      case 'devices':
        return <DeviceManagement />;
      case 'deviceSettings':
        return <DeviceSettings />;
      case 'addUser':
        return <Addnewuser userId={userId} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && (
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-blue-600">KEYFLOW</span>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      currentPage === 'home'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('users')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      currentPage === 'users'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setCurrentPage('devices')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      currentPage === 'devices'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Devices
                  </button>
                </nav>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-grow">{renderContent()}</main>
    </div>
  );
};

export default UserAccessSystem;
