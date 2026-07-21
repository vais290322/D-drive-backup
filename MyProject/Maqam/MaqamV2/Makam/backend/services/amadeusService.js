import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Amadeus = require('amadeus');
import dotenv from 'dotenv';

dotenv.config();

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Helper to normalize Amadeus flight data
const mapAmadeusToFlight = (offer) => {
    const itinerary = offer.itineraries[0];
    const segment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    return {
        id: offer.id,
        airline: offer.validatingAirlineCodes?.[0] || segment.carrierCode,
        flight_number: `${segment.carrierCode}${segment.number}`,
        departure_city: segment.departure.iataCode,
        arrival_city: lastSegment.arrival.iataCode,
        departure_time: segment.departure.at,
        arrival_time: lastSegment.arrival.at,
        price: parseFloat(offer.price.grandTotal || offer.price.total),
        available_seats: offer.numberOfBookableSeats || 9,
        is_direct: itinerary.segments.length === 1,
        created_at: new Date().toISOString(),
        source_data: offer,
    };
};

export const searchFlights = async (origin, destination, departureDate, adults = 1) => {
    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            adults: adults,
        });

        if (response.data && Array.isArray(response.data)) {
            return response.data.map(mapAmadeusToFlight);
        }

        return [];
    } catch (error) {
        console.error('Amadeus Flight Search Error:', error);
        return [];
    }
};

// Helper to normalize Amadeus hotel offer data
const mapAmadeusToHotelOffer = (offer) => {
    return {
        id: offer.hotel?.hotelId || offer.hotelId || offer.id,
        name: offer.hotel?.name,
        cityCode: offer.hotel?.cityCode,
        address: offer.hotel?.address,
        rating: offer.hotel?.rating,
        amenities: offer.hotel?.amenities,
        price: offer.offers?.[0]?.price?.total || offer.price?.total,
        currency: offer.offers?.[0]?.price?.currency || offer.price?.currency,
        checkInDate: offer.offers?.[0]?.checkInDate,
        checkOutDate: offer.offers?.[0]?.checkOutDate,
        roomType: offer.offers?.[0]?.room?.type,
        source_data: offer,
    };
};

export const searchHotels = async (cityCode, checkInDate, checkOutDate, adults = 1) => {
    try {
        const response = await amadeus.shopping.hotelOffers.get({
            cityCode,
            checkInDate,
            checkOutDate,
            adults,
        });
        if (response.data && Array.isArray(response.data)) {
            return response.data.map(mapAmadeusToHotelOffer);
        }
        return [];
    } catch (error) {
        console.error('Amadeus Hotel Search Error:', error);
        return [];
    }
};
