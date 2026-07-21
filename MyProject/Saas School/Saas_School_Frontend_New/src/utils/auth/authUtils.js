// Simple utility to get the auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Other auth utilities can go here