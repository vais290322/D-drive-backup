
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

const testUser = {
    username: 'apitestuser',
    email: 'apitest@maquam.com',
    password: 'password123',
    full_name: 'API Tester',
    phone: '1234567890'
};

const section = (title: string) => {
    console.log('\n' + '='.repeat(50));
    console.log(`🔷 ${title}`);
    console.log('='.repeat(50));
};

const logRequest = (method: string, url: string, data?: any, token?: string) => {
    console.log(`\n📤 REQUEST: [${method}] ${url}`);
    if (token) console.log(`   Headers: { Authorization: 'Bearer ${token.substring(0, 10)}...' }`);
    if (data) console.log(`   Payload:`, JSON.stringify(data, null, 2));
};

const logResponse = (res: any) => {
    console.log(`\n📥 RESPONSE: [${res.status} ${res.statusText}]`);
    console.log(`   Data:`, JSON.stringify(res.data, null, 2));
};

const runTests = async () => {
    let token = '';
    let hotelId = '';

    // 1. REGISTER
    section('1. AUTHENTICATION (Register/Login)');
    try {
        logRequest('POST', `${BASE_URL}/auth/register`, testUser);
        await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('✅ Registered successfully (or user exists)');
    } catch (e: any) {
        if (e.response?.data?.error?.includes('exists')) {
            console.log('ℹ️ User already exists, proceeding to login...');
        } else {
            console.error('❌ Register Failed:', e.message);
        }
    }

    // 2. LOGIN
    try {
        logRequest('POST', `${BASE_URL}/auth/login`, { email: testUser.email, password: testUser.password });
        const res = await axios.post(`${BASE_URL}/auth/login`, { email: testUser.email, password: testUser.password });
        logResponse(res);
        token = res.data.token;
        console.log('✅ Login Successful');
    } catch (e: any) {
        console.error('❌ Login Failed:', e.message);
        return;
    }

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. SEARCH HOTELS
    section('2. SEARCH HOTELS');
    try {
        const url = `${BASE_URL}/hotels`;
        logRequest('GET', url);
        const res = await axios.get(url);
        // Limit output
        const preview = { ...res.data, hotels: res.data.hotels?.slice(0, 1) || res.data.slice(0, 1) };
        console.log(`\n📥 RESPONSE: [${res.status}] (Showing 1 result)`);
        console.log(JSON.stringify(preview, null, 2));

        if (preview.hotels && preview.hotels.length > 0) {
            hotelId = preview.hotels[0]._id || preview.hotels[0].id;
        } else if (Array.isArray(preview) && preview.length > 0) {
            hotelId = preview[0]._id || preview[0].id;
        }
    } catch (e: any) {
        console.error('❌ Hotel Search Failed:', e.message);
    }

    // 4. SEARCH FLIGHTS (Mocking if Amadeus not active, but trying real endpoint)
    section('3. SEARCH FLIGHTS (Amadeus)');
    try {
        // Corrected route based on amadeusRoutes.ts
        const url = `${BASE_URL}/amadeus/flights/search?origin=JED&destination=DEL&date=2026-05-01&adults=1`;
        logRequest('GET', url);

        // This might fail if Amadeus keys aren't set, but we want to see the error payload
        const res = await axios.get(url, { validateStatus: () => true });
        logResponse(res);
    } catch (e: any) {
        console.error('❌ Flight Search Failed:', e.message);
    }

    // 5. CREATE FLIGHT BOOKING
    section('4. CREATE BOOKING (Flight)');
    try {
        const payload = {
            booking_type: 'flight',
            guests: 1,
            guest_name: 'API Tester',
            guest_email: 'apitest@maquam.com',
            guest_phone: '1234567890',
            total_amount: 5000,
            flight_data: {
                id: 'mock-flight-123',
                airline: 'Saudia',
                flight_number: 'SV123',
                departure_time: new Date().toISOString(), // NOW
                arrival_time: new Date(Date.now() + 14400000).toISOString(), // +4 hours
                price: 5000
            }
        };

        logRequest('POST', `${BASE_URL}/bookings`, payload, token);
        const res = await axios.post(`${BASE_URL}/bookings`, payload, authHeaders);
        logResponse(res);
        console.log('✅ Flight Booking Created');
    } catch (e: any) {
        console.error('❌ Create Flight Booking Failed:', e.response?.data || e.message);
    }

    // 6. CREATE HOTEL BOOKING (if hotel found)
    if (hotelId) {
        section('5. CREATE BOOKING (Hotel)');
        try {
            const payload = {
                booking_type: 'hotel',
                hotel_id: hotelId,
                check_in_date: new Date().toISOString(),
                check_out_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
                guests: 2,
                room_type: 'Standard',
                guest_name: 'API Tester',
                guest_email: 'apitest@maquam.com',
                guest_phone: '1234567890',
                total_amount: 15000
            };

            logRequest('POST', `${BASE_URL}/bookings`, payload, token);
            const res = await axios.post(`${BASE_URL}/bookings`, payload, authHeaders);
            logResponse(res);
            console.log('✅ Hotel Booking Created');
        } catch (e: any) {
            console.error('❌ Create Hotel Booking Failed:', e.response?.data || e.message);
        }
    }
};

runTests();
