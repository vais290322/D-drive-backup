/**
 * Mock In-Memory Database for Development
 * 
 * Used when MongoDB is not available (cloud development environment)
 */

interface MockUser {
  _id: string;
  email: string;
  password: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin' | 'hotelier';
  email_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  last_login?: Date;
}

class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private userIdCounter = 1;

  constructor() {
    // Initialize with default admin user
    this.createDefaultUsers();
  }

  private createDefaultUsers() {
    const bcrypt = require('bcryptjs');
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const userPassword = bcrypt.hashSync('user123', 10);
    const hotelierPassword = bcrypt.hashSync('hotelier123', 10);

    const admin: MockUser = {
      _id: '1',
      email: 'admin@maquamholidays.com',
      password: adminPassword,
      username: 'admin',
      full_name: 'Admin User',
      role: 'admin',
      email_verified: true,
      phone_verified: false,
      created_at: new Date(),
    };

    const user: MockUser = {
      _id: '2',
      email: 'user@maquamholidays.com',
      password: userPassword,
      username: 'user',
      full_name: 'Test User',
      role: 'user',
      email_verified: true,
      phone_verified: false,
      created_at: new Date(),
    };

    const hotelier: MockUser = {
      _id: '3',
      email: 'hotelier@maquamholidays.com',
      password: hotelierPassword,
      username: 'hotelier',
      full_name: 'Hotel Manager',
      role: 'hotelier',
      email_verified: true,
      phone_verified: false,
      created_at: new Date(),
    };

    this.users.set(admin.email, admin);
    this.users.set(user.email, user);
    this.users.set(hotelier.email, hotelier);
  }

  // User operations
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.get(email) || null;
  }

  async findUserByUsername(username: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user._id === id) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData: Omit<MockUser, '_id' | 'created_at'>): Promise<MockUser> {
    const id = String(this.userIdCounter++);
    const user: MockUser = {
      ...userData,
      _id: id,
      created_at: new Date(),
    };
    this.users.set(user.email, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    const user = await this.findUserById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(updatedUser.email, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findUserById(id);
    if (!user) return false;
    this.users.delete(user.email);
    return true;
  }

  async getAllUsers(): Promise<MockUser[]> {
    return Array.from(this.users.values());
  }
}

// Singleton instance
export const mockDB = new MockDatabase();

export type { MockUser };
