import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getSocket, initSocket } from '../services/socketService';

const UserList = ({ onSelectUser, selectedUser, unreadCounts = {} }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Make sure socket is initialized if not already
    if (currentUser && (currentUser.id || currentUser._id)) {
      initSocket((currentUser.id || currentUser._id));
    }
    
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        const response = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
    
    // Now get the socket after ensuring it's initialized
    const socket = getSocket();
    
    // Listen for real-time status changes
    socket.on('user-status-change', ({ userId, isOnline }) => {
      console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isOnline } : user
        )
      );
    });
    
    return () => {
      socket.off('user-status-change');
    };
  }, [selectedUser, currentUser]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Contacts</h2>
      </div>
      
      {loading ? (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex-1 flex justify-center items-center p-4">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users
              .filter(user => user._id !== (currentUser.id || currentUser._id))
              .map(user => (
                <li 
                  key={user._id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    selectedUser && selectedUser._id === user._id ? 'bg-gray-100 dark:bg-gray-600' : ''
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-center px-4 py-3 relative">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 uppercase font-semibold">
                        {user.username.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      
                      {/* Unread message count badge */}
                      {unreadCounts[user._id] > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {unreadCounts[user._id]}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;