import request from 'supertest';
import express from 'express';
import { User } from '../../models/User';
import authRoutes from '../../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser',
                full_name: 'Test User',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.username).toBe(userData.username);
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should fail with duplicate email', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'password123',
                username: 'user1',
                full_name: 'User One',
            };

            // Create first user
            await request(app).post('/api/auth/register').send(userData);

            // Try to create duplicate
            const response = await request(app)
                .post('/api/auth/register')
                .send({ ...userData, username: 'user2' })
                .expect(400);

            expect(response.body.error).toContain('already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app).post('/api/auth/register').send({
                email: 'login@example.com',
                password: 'password123',
                username: 'loginuser',
                full_name: 'Login User',
            });
        });

        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('login@example.com');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword',
                })
                .expect(401);

            expect(response.body.error).toContain('Invalid');
        });

        it('should fail with non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                })
                .expect(401);

            expect(response.body.error).toContain('Invalid');
        });
    });
});
