import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../db/database.js';
import { Hotel } from '../model/Hotel.js';

dotenv.config();

const demoHotels = [
    {
        name: 'Pullman Zamzam Makkah',
        description: 'Luxury hotel located in the Abraj Al Bait complex, directly facing the Holy Kaaba. Features elegant rooms and suites with panoramic views.',
        location: 'Abraj Al Bait Complex',
        city: 'Makkah',
        country: 'Saudi Arabia',
        address: 'King Abdul Aziz Endowment, Makkah',
        star_rating: 5,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Free Wi-Fi', 'Prayer Hall', 'Restaurant', 'Room Service', 'Kaaba View'],
        check_in_time: '16:00',
        check_out_time: '12:00',
        price_per_night: 15000,
        currency: 'INR',
        is_active: true,
        is_verified: true,
        owner_id: new mongoose.Types.ObjectId(),
        proximity_to_haram: 0,
        prayer_facilities: true,
        halal_food: true,
    },
    {
        name: 'Swissôtel Al Maqam Makkah',
        description: 'Contemporary hotel with direct access to the Holy Mosque via Ajyad Street. Offers refined hospitality and diverse dining options.',
        location: 'King Abdul Aziz Endowment',
        city: 'Makkah',
        country: 'Saudi Arabia',
        address: 'King Abdul Aziz Endowment, Makkah',
        star_rating: 5,
        images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Direct Haram Access', 'Dining', 'Prayer Room'],
        check_in_time: '16:00',
        check_out_time: '12:00',
        price_per_night: 12500,
        currency: 'INR',
        is_active: true,
        is_verified: true,
        owner_id: new mongoose.Types.ObjectId(),
        proximity_to_haram: 100,
        prayer_facilities: true,
        halal_food: true,
    },
    {
        name: "Anwar Al Madinah Mövenpick",
        description: "The closest hotel to the Prophet's Mosque. Offers elegant rooms and connects directly to the shopping mall.",
        location: 'Central Area',
        city: 'Madinah',
        country: 'Saudi Arabia',
        address: 'Central Zone, Madinah',
        star_rating: 5,
        images: [
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        ],
        amenities: ['Close to Masjid Nabawi', 'Shopping Mall Access', 'Free Parking'],
        check_in_time: '16:00',
        check_out_time: '12:00',
        price_per_night: 9500,
        currency: 'INR',
        is_active: true,
        is_verified: true,
        owner_id: new mongoose.Types.ObjectId(),
        proximity_to_masjid_nabawi: 200,
        prayer_facilities: true,
        halal_food: true,
    },
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const count = await Hotel.countDocuments();
        if (count === 0) {
            console.log('Seeding hotels...');
            await Hotel.insertMany(demoHotels);
            console.log('Hotels seeded successfully');
        } else {
            console.log('Hotels already exist, skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
