import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { initSocket, getSocket, closeSocket } from '../services/socketService';
import axios from 'axios';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (currentUser && (currentUser.id || currentUser._id)) {
      // Initialize socket connection
      initSocket((currentUser.id || currentUser._id));
      
      const socket = getSocket();
      
      // Listen for new messages to update notifications
      socket.on('private-message', (message) => {
        if (!selectedUser || selectedUser._id !== message.from) {
          // Add to notifications if not currently chatting with this user
          setNotifications(prev => [
            { 
              userId: message.from, 
              username: message.username,
              message: message.message,
              timestamp: message.timestamp,
              read: false
            },
            ...prev.slice(0, 9) // Keep only the 10 most recent notifications
          ]);
          
          // Update unread counts
          setUnreadCounts(prev => ({
            ...prev,
            [message.from]: (prev[message.from] || 0) + 1
          }));
        }
      });
      
      // Listen for online users
      socket.on('online-users', (onlineUsers) => {
        console.log('Received online users:', onlineUsers);
      });
      
      // Fetch initial unread counts
      fetchUnreadCounts();
    }
    
    return () => {
      // Clean up socket connection
      closeSocket();
    };
  }, [currentUser, selectedUser]);
  
  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.get('http://localhost:5000/api/messages/unread/count', config);
      const counts = {};
      
      response.data.forEach(item => {
        counts[item.senderId] = item.count;
      });
      
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsMobileMenuOpen(false);
    
    // Only clear notifications for this specific user
    setNotifications(prev => prev.filter(n => n.userId !== user._id));
    
    // Reset unread count for this user only
    setUnreadCounts(prev => ({
      ...prev,
      [user._id]: 0
    }));
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  };



  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-800 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">WhatsChat</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-1 rounded-full hover:bg-green-700 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {getTotalUnreadCount() > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {getTotalUnreadCount()}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      {Object.keys(unreadCounts).length} users
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((notification, index) => (
                          <li key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={async () => {
                            try {
                              // Fetch user details if we only have the ID
                              const token = localStorage.getItem('token');
                              const config = {
                                headers: {
                                  'x-auth-token': token
                                }
                              };
                              
                              const response = await axios.get(`http://localhost:5000/api/auth/user/${notification.userId}`, config);
                              handleSelectUser(response.data);
                              setShowNotifications(false);
                            } catch (error) {
                              console.error('Error fetching user details:', error);
                            }
                          }}>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                {notification.username ? notification.username.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.username || 'User'} 
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({unreadCounts[notification.userId] || 0} messages)
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden md:block text-sm">
              Logged in as <span className="font-semibold">{currentUser?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - always visible on desktop, toggleable on mobile */}
        <div className={`${
          isMobileMenuOpen || !selectedUser ? 'block' : 'hidden'
        } md:block w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <UserList 
            onSelectUser={handleSelectUser} 
            selectedUser={selectedUser} 
            unreadCounts={unreadCounts}
          />
        </div>
        
        {/* Chat window - hidden on mobile when sidebar is open */}
        <div className={`${
          isMobileMenuOpen && selectedUser ? 'hidden' : 'block'
        } md:block w-full md:w-2/3 lg:w-3/4`}>
          <ChatWindow 
            selectedUser={selectedUser} 
            onBack={() => setIsMobileMenuOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;