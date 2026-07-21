// Mock Authentication Service using localStorage
// This provides fully functional login/signup without a backend

import { USERS } from "@/data/userData";

const USERS_KEY = "ds-pharma-users";

// Initialize demo users in localStorage
const initializeDemoUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  if (existingUsers.length === 0) {
    localStorage.setItem(USERS_KEY, JSON.stringify(USERS));
  } else {
    // Optional: Merge new mock users if they don't exist
    let updated = false;
    USERS.forEach((mockUser) => {
      if (!existingUsers.find((u) => u.email === mockUser.email)) {
        existingUsers.push(mockUser);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
    }
  }
};

// Initialize on module load
initializeDemoUsers();

export const mockAuthService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const { password: _password, ...userWithoutPassword } = user;
          const token = btoa(
            JSON.stringify({
              userId: user.id,
              email: user.email,
              timestamp: Date.now(),
            })
          );

          resolve({
            data: {
              user: userWithoutPassword,
              token: token,
              message: "Login successful",
            },
          });
        } else {
          reject({
            response: {
              data: {
                message: "Invalid email or password",
              },
            },
          });
        }
      }, 500); // Simulate network delay
    });
  },

  /**
   * Register new user
   */
  signup: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const existingUser = users.find((u) => u.email === userData.email);

        if (existingUser) {
          reject({
            response: {
              data: {
                message: "Email already registered",
              },
            },
          });
          return;
        }

        const newUser = {
          id: users.length + 1,
          ...userData,
          dateOfBirth: "",
          gender: "",
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          },
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const { password: _password, ...userWithoutPassword } = newUser;
        const token = btoa(
          JSON.stringify({
            userId: newUser.id,
            email: newUser.email,
            timestamp: Date.now(),
          })
        );

        resolve({
          data: {
            user: userWithoutPassword,
            token: token,
            message: "Signup successful",
          },
        });
      }, 500);
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            message: "Logout successful",
          },
        });
      }, 300);
    });
  },

  /**
   * Get user profile
   */
  getProfile: async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const decoded = JSON.parse(atob(token));
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
          const user = users.find((u) => u.id === decoded.userId);

          if (user) {
            const { password: _password, ...userWithoutPassword } = user;
            resolve({
              data: userWithoutPassword,
            });
          } else {
            reject({
              response: {
                data: {
                  message: "User not found",
                },
              },
            });
          }
          // eslint-disable-next-line no-unused-vars
        } catch (_error) {
          reject({
            response: {
              data: {
                message: "Invalid token",
              },
            },
          });
        }
      }, 300);
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData, token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const decoded = JSON.parse(atob(token));
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
          const userIndex = users.findIndex((u) => u.id === decoded.userId);

          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            const { password: _password, ...userWithoutPassword } =
              users[userIndex];
            resolve({
              data: userWithoutPassword,
            });
          } else {
            reject({
              response: {
                data: {
                  message: "User not found",
                },
              },
            });
          }
          // eslint-disable-next-line no-unused-vars
        } catch (_error) {
          reject({
            response: {
              data: {
                message: "Update failed",
              },
            },
          });
        }
      }, 500);
    });
  },
};
