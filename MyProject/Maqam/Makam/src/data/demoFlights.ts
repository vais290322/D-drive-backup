
import { Flight } from '@/types';

export const demoFlights: Flight[] = [
    {
        id: 'f1',
        airline: 'Saudia',
        flight_number: 'SV 123',
        departure_city: 'New Delhi (DEL)',
        arrival_city: 'Jeddah (JED)',
        departure_time: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
        arrival_time: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow + 5h
        price: 35000,
        available_seats: 45,
        is_direct: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'f2',
        airline: 'Emirates',
        flight_number: 'EK 505',
        departure_city: 'Mumbai (BOM)',
        arrival_city: 'Madinah (MED)',
        departure_time: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        arrival_time: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        price: 42000,
        available_seats: 12,
        is_direct: false,
        created_at: new Date().toISOString()
    },
    {
        id: 'f3',
        airline: 'IndiGo',
        flight_number: '6E 1718',
        departure_city: 'Hyderabad (HYD)',
        arrival_city: 'Jeddah (JED)',
        departure_time: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        arrival_time: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        price: 28000,
        available_seats: 4,
        is_direct: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'f4',
        airline: 'Flynas',
        flight_number: 'XY 330',
        departure_city: 'Lucknow (LKO)',
        arrival_city: 'Riyadh (RUH)',
        departure_time: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
        arrival_time: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
        price: 22000,
        available_seats: 60,
        is_direct: true,
        created_at: new Date().toISOString()
    }
];
