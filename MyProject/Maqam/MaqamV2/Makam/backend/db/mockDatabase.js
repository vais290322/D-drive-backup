/**
 * Mock In-Memory Database for Development
 *
 * Used when MongoDB is not available
 */

import bcrypt from 'bcryptjs';

class MockDatabase {
    #users = new Map();
    #userIdCounter = 1;

    constructor() {
        this.#createDefaultUsers();
    }

    #createDefaultUsers() {
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const userPassword = bcrypt.hashSync('user123', 10);
        const hotelierPassword = bcrypt.hashSync('hotelier123', 10);

        const admin = {
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

        const user = {
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

        const hotelier = {
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

        this.#users.set(admin.email, admin);
        this.#users.set(user.email, user);
        this.#users.set(hotelier.email, hotelier);
    }

    // User operations
    async findUserByEmail(email) {
        return this.#users.get(email) || null;
    }

    async findUserByUsername(username) {
        for (const user of this.#users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    async findUserById(id) {
        for (const user of this.#users.values()) {
            if (user._id === id) {
                return user;
            }
        }
        return null;
    }

    async createUser(userData) {
        const id = String(this.#userIdCounter++);
        const user = {
            ...userData,
            _id: id,
            created_at: new Date(),
        };
        this.#users.set(user.email, user);
        return user;
    }

    async updateUser(id, updates) {
        const user = await this.findUserById(id);
        if (!user) return null;

        const updatedUser = { ...user, ...updates };
        this.#users.set(updatedUser.email, updatedUser);
        return updatedUser;
    }

    async deleteUser(id) {
        const user = await this.findUserById(id);
        if (!user) return false;
        this.#users.delete(user.email);
        return true;
    }

    async getAllUsers() {
        return Array.from(this.#users.values());
    }
}

// Singleton instance
export const mockDB = new MockDatabase();
