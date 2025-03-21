// "use client";

// import React, { useState } from 'react';
// import { Layout, User, UserPlus, Activity, Settings, Menu, X } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import DeviceManagement from './DeviceManagement';
// import AddNewUser from './Addnewuser';
// import DeviceSettings from './DeviceSettings';
// import UserManagement from './UserManagment';
// import Homepage from './HomePage';

// const UserAccessSystem: React.FC = () => {
//   const [authenticated, setAuthenticated] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<string>('home');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [loginEmail, setLoginEmail] = useState<string>('');
//   const [loginPassword, setLoginPassword] = useState<string>('');
//   const [signupEmail, setSignupEmail] = useState<string>('');
//   const [signupPassword, setSignupPassword] = useState<string>('');
//   const [signupName, setSignupName] = useState<string>('');
//   const [authToken, setAuthToken] = useState<string | null>(null);

//   // API base URL
//   const API_BASE_URL = 'https://sxera9zsa1.execute-api.ap-southeast-2.amazonaws.com/dev';

//   // Check authentication status on load
//   React.useEffect(() => {
//     if (authToken) {
//       setAuthenticated(true);
//       setCurrentPage('home');
//     }
//   }, [authToken]);

//   const handleLogin = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: loginEmail, password: loginPassword }),
//       });

//       const data = await response.json();

//       if (data.tokens && data.tokens.IdToken) {
//         setAuthToken(data.tokens.IdToken);
//         localStorage.setItem('authToken', data.tokens.IdToken);
//         setAuthenticated(true);
//         setCurrentPage('home');
//       } else {
//         alert('Login failed: Invalid credentials');
//       }
//     } catch (error) {
//       alert('Login failed: ' + error);
//     }
//   };

//   const handleSignup = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: signupEmail, password: signupPassword, name: signupName }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Sign-up successful! Please verify your email.');
//         setSignupEmail('');
//         setSignupPassword('');
//         setSignupName('');
//         // Show the verification form (you can manage this via conditional rendering if needed)
//       } else {
//         alert('Sign-up failed: ' + data.error);
//       }
//     } catch (error) {
//       alert('Sign-up failed: ' + error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     setAuthToken(null);
//     setAuthenticated(false);
//     setCurrentPage('home');
//   };

//   // Navigation items
//   const navigationItems = [
//     { icon: <Layout size={20} />, label: 'Users', page: 'users' },
//     { icon: <Settings size={20} />, label: 'Device Management', page: 'devices' },
//     { icon: <UserPlus size={20} />, label: 'Add New User', page: 'addUser' },
//     { icon: <Activity size={20} />, label: 'Device Settings', page: 'deviceSettings' }
//   ];

//   // Conditional rendering based on authentication status
//   if (!authenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <Card className="w-full max-w-lg p-8 shadow-lg rounded-xl bg-white">
//           <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 cursor-pointer hover:text-blue-600">
//             IoT Lock Access System
//           </h1>

//           <div id="loginForm" className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800">Login</h3>
//             <div className="space-y-4">
//               <input
//                 type="email"
//                 value={loginEmail}
//                 onChange={(e) => setLoginEmail(e.target.value)}
//                 placeholder="Email"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//               <input
//                 type="password"
//                 value={loginPassword}
//                 onChange={(e) => setLoginPassword(e.target.value)}
//                 placeholder="Password"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//             </div>
//             <button
//               onClick={handleLogin}
//               className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Login
//             </button>
//           </div>

//           <div id="signupForm" className="mt-10 space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800">Sign Up</h3>
//             <div className="space-y-4">
//               <input
//                 type="email"
//                 value={signupEmail}
//                 onChange={(e) => setSignupEmail(e.target.value)}
//                 placeholder="Email"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//               <input
//                 type="password"
//                 value={signupPassword}
//                 onChange={(e) => setSignupPassword(e.target.value)}
//                 placeholder="Password"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//               <input
//                 type="text"
//                 value={signupName}
//                 onChange={(e) => setSignupName(e.target.value)}
//                 placeholder="Name"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
//               />
//             </div>
//             <button
//               onClick={handleSignup}
//               className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               Sign Up
//             </button>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col sm:flex-row">
//       {/* Mobile Menu Button */}
//       <div className="sm:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
//         <h1 className="text-xl font-bold">K E Y F L O W</h1>
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 hover:bg-gray-700 rounded"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`${
//           isMobileMenuOpen ? 'block' : 'hidden'
//         } sm:block w-full sm:w-64 bg-gray-800 text-white`}
//       >
//         <div className="hidden sm:block p-4">
//           <h1
//             className="text-2xl font-bold mb-6 cursor-pointer hover:text-blue-600"
//             onClick={() => setCurrentPage('home')}
//           >
//             IoT Lock Access System
//           </h1>
//         </div>
//         <nav className="mt-4">
//           {navigationItems.map((item) => (
//             <button
//               key={item.page}
//               onClick={() => {
//                 setCurrentPage(item.page);
//                 setIsMobileMenuOpen(false);
//               }}
//               className={`w-full p-4 flex items-center gap-2 ${
//                 currentPage === item.page
//                   ? 'bg-gray-700'
//                   : 'hover:bg-gray-700'
//               }`}
//             >
//               {item.icon}
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 bg-gray-50 overflow-auto">
//         <div className="max-w-7xl mx-auto p-4">
//           {currentPage === 'home' && <Homepage onNavigate={setCurrentPage} />}
//           {currentPage === 'users' && <UserManagement />}
//           {currentPage === 'devices' && <DeviceManagement />}
//           {currentPage === 'addUser' && <AddNewUser />}
//           {currentPage === 'deviceSettings' && <DeviceSettings />}
//         </div>
//       </div>

//       {/* Logout Button */}
//       <div className="fixed bottom-4 right-4">
//         <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-lg">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserAccessSystem;

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupName, setSignupName] = useState<string>('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');

  // API base URL
  const API_BASE_URL = 'https://sxera9zsa1.execute-api.ap-southeast-2.amazonaws.com/dev';

  // Check authentication status on load
  React.useEffect(() => {
    if (authToken) {
      setAuthenticated(true);
      setCurrentPage('home');
    }
  }, [authToken]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (data.tokens && data.tokens.IdToken) {
        setAuthToken(data.tokens.IdToken);
        localStorage.setItem('authToken', data.tokens.IdToken);
        setAuthenticated(true);
        setCurrentPage('home');
      } else {
        alert('Login failed: Invalid credentials');
      }
    } catch (error) {
      alert('Login failed: ' + error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, name: signupName }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Sign-up successful! Please verify your email.');
        setVerificationEmail(signupEmail);
        setShowVerification(true);
      } else {
        alert('Sign-up failed: ' + data.error);
      }
    } catch (error) {
      alert('Sign-up failed: ' + error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Email verified successfully! Please login.');
        setShowVerification(false);
      } else {
        alert('Verification failed: ' + (data.error || 'Invalid verification code'));
      }
    } catch (error) {
      alert('Verification failed: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setAuthenticated(false);
    setCurrentPage('home');
  };

  // Navigation items
  const navigationItems = [
    { icon: <Layout size={20} />, label: 'Users', page: 'users' },
    { icon: <Settings size={20} />, label: 'Device Management', page: 'devices' },
    { icon: <UserPlus size={20} />, label: 'Add New User', page: 'addUser' },
    { icon: <Activity size={20} />, label: 'Device Settings', page: 'deviceSettings' }
  ];

  // Conditional rendering based on authentication status
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg p-8 shadow-lg rounded-xl bg-white">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 cursor-pointer hover:text-blue-600">
            IoT Lock Access System
          </h1>

          {showVerification ? (
            <div id="verificationForm" className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">Verify Email</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Verification Code"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <button
                onClick={handleVerifyEmail}
                className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Verify Email
              </button>
            </div>
          ) : (
            <>
              <div id="loginForm" className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Login</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>

              <div id="signupForm" className="mt-10 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Sign Up</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Name"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSignup}
                  className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } sm:block w-full sm:w-64 bg-gray-800 text-white`}
      >
        <div className="hidden sm:block p-4">
          <h1
            className="text-2xl font-bold mb-6 cursor-pointer hover:text-blue-600"
            onClick={() => setCurrentPage('home')}
          >
            IoT Lock Access System
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
          {currentPage === 'users' && <UserManagement onNavigate={setCurrentPage} />}
          {currentPage === 'devices' && <DeviceManagement />}
          {currentPage === 'addUser' && <AddNewUser />}
          {currentPage === 'deviceSettings' && <DeviceSettings />}
        </div>
      </div>
    </div>
  );
  
};

export default UserAccessSystem;
