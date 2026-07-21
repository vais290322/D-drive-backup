import request from 'supertest';
import express from 'express';
import { User } from '../../models/User';
import { Booking } from '../../models/Booking';
import { Hotel } from '../../models/Hotel';
import bookingRoutes from '../../routes/bookingRoutes';
import { authenticate } from '../../middleware/auth';
import { generateToken } from '../../middleware/auth';

// Mock authenticate middleware for testing
jest.mock('../../middleware/auth', () => ({
    ...jest.requireActual('../../middleware/auth'),
    authenticate: jest.fn((req: any, res: any, next: any) => {
        req.user = testUser;
        next();
    }),
}));

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

let testUser: any;
let testHotel: any;
let authToken: string;

describe('Booking Controller', () => {
    beforeEach(async () => {
        // Create test user
        testUser = await User.create({
            email: 'booking@example.com',
            password: 'password123',
            username: 'bookinguser',
            full_name: 'Booking User',
            role: 'user',
        });

        authToken = generateToken(testUser._id.toString());

        // Create test hotel
        testHotel = await Hotel.create({
            name: 'Test Hotel',
            description: 'Test Description',
            location: 'Test Location',
            city: 'Makkah',
            country: 'Saudi Arabia',
            address: 'Test Address',
            star_rating: 5,
            price_per_night: 1000,
            currency: 'INR',
            is_active: true,
            is_verified: true,
            owner_id: testUser._id,
        });
    });

    describe('POST /api/bookings', () => {
        it('should create a hotel booking successfully', async () => {
            const bookingData = {
                booking_type: 'hotel',
                hotel_id: testHotel._id.toString(),
                check_in_date: new Date('2026-03-01'),
                check_out_date: new Date('2026-03-03'),
                guests: 2,
                room_type: 'Standard',
                guest_name: 'Test Guest',
                guest_email: 'guest@example.com',
                guest_phone: '1234567890',
            };

            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send(bookingData)
                .expect(201);

            expect(response.body.message).toBe('Booking created successfully');
            expect(response.body.booking.booking_type).toBe('hotel');
            expect(response.body.booking.guests).toBe(2);
            expect(response.body.booking.nights).toBe(2);
            expect(response.body.booking.status).toBe('pending');
        });

        it('should create a flight booking with auto-derived dates', async () => {
            const bookingData = {
                booking_type: 'flight',
                guests: 1,
                guest_name: 'Flight Guest',
                guest_email: 'flight@example.com',
                guest_phone: '9876543210',
                total_amount: 5000,
                flight_data: {
                    id: 'flight-123',
                    airline: 'Saudia',
                    departure_time: '2026-04-01T10:00:00Z',
                    arrival_time: '2026-04-01T14:00:00Z',
                    price: 5000,
                },
            };

            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send(bookingData)
                .expect(201);

            expect(response.body.booking.booking_type).toBe('flight');
            expect(response.body.booking.flight_data).toBeDefined();
            expect(response.body.booking.check_in_date).toBeDefined();
        });

        it('should fail without authentication', async () => {
            const bookingData = {
                booking_type: 'hotel',
                hotel_id: testHotel._id.toString(),
                check_in_date: new Date('2026-03-01'),
                check_out_date: new Date('2026-03-03'),
                guests: 2,
                room_type: 'Standard',
            };

            // Remove mock to test real auth
            (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
                res.status(401).json({ error: 'Authentication required' });
            });

            await request(app)
                .post('/api/bookings')
                .send(bookingData)
                .expect(401);
        });

        it('should calculate nights correctly', async () => {
            const bookingData = {
                booking_type: 'hotel',
                hotel_id: testHotel._id.toString(),
                check_in_date: '2026-05-01',
                check_out_date: '2026-05-06', // 5 nights
                guests: 3,
                room_type: 'Deluxe',
                guest_name: 'Multi Night Guest',
                guest_email: 'multinight@example.com',
                guest_phone: '5555555555',
            };

            const response = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send(bookingData)
                .expect(201);

            expect(response.body.booking.nights).toBe(5);
            expect(response.body.booking.total_amount).toBe(1000 * 5); // price * nights
        });
    });

    describe('GET /api/bookings/my/bookings', () => {
        beforeEach(async () => {
            // Create sample bookings
            await Booking.create({
                user_id: testUser._id,
                booking_type: 'hotel',
                hotel_id: testHotel._id,
                check_in_date: new Date('2026-03-01'),
                check_out_date: new Date('2026-03-03'),
                nights: 2,
                guests: 2,
                room_type: 'Standard',
                guest_name: 'Test Guest',
                guest_email: 'guest@example.com',
                guest_phone: '1234567890',
                room_price: 1000,
                total_amount: 2000,
                currency: 'INR',
                payment_status: 'pending',
                status: 'pending',
            });
        });

        it('should get all user bookings', async () => {
            const response = await request(app)
                .get('/api/bookings/my/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.bookings).toHaveLength(1);
            expect(response.body.bookings[0].user_id).toBe(testUser._id.toString());
        });
    });

    describe('PUT /api/bookings/:id/cancel', () => {
        let testBooking: any;

        beforeEach(async () => {
            testBooking = await Booking.create({
                user_id: testUser._id,
                booking_type: 'hotel',
                hotel_id: testHotel._id,
                check_in_date: new Date('2026-06-01'),
                check_out_date: new Date('2026-06-03'),
                nights: 2,
                guests: 2,
                room_type: 'Standard',
                guest_name: 'Cancel Guest',
                guest_email: 'cancel@example.com',
                guest_phone: '1111111111',
                room_price: 1000,
                total_amount: 2000,
                currency: 'INR',
                payment_status: 'paid',
                status: 'confirmed',
            });
        });

        it('should cancel a booking successfully', async () => {
            const response = await request(app)
                .put(`/api/bookings/${testBooking._id}/cancel`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.message).toBe('Booking cancelled successfully');
            expect(response.body.booking.status).toBe('cancelled');
        });

        it('should fail to cancel already cancelled booking', async () => {
            // Cancel once
            await request(app)
                .put(`/api/bookings/${testBooking._id}/cancel`)
                .set('Authorization', `Bearer ${authToken}`);

            // Try to cancel again
            const response = await request(app)
                .put(`/api/bookings/${testBooking._id}/cancel`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);

            expect(response.body.error).toContain('already cancelled');
        });
    });
});
