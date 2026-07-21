// @ts-ignore
const Amadeus = require('amadeus');
import dotenv from 'dotenv';

dotenv.config();

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Helper to normalize Amadeus flight data
const mapAmadeusToFlight = (offer: any) => {
    const itinerary = offer.itineraries[0];
    const segment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    return {
        id: offer.id,
        // In a real app, we'd look up the carrier name from dictionaries
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
        // Raw data for booking reference if needed
        source_data: offer
    };
};

export const searchFlights = async (
    origin: string,
    destination: string,
    departureDate: string,
    adults: number = 1
) => {
    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: departureDate,
            adults: adults,
        });

        // Normalize the data before returning
        if (response.data && Array.isArray(response.data)) {
            return response.data.map(mapAmadeusToFlight);
        }

        return [];
    } catch (error) {
        console.error('Amadeus Flight Search Error:', error);
        // Return empty array instead of throwing to prevent frontend crash
        return [];
    }
};

export const searchHotels = async (cityCode: string) => {
    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,
        });
        return response.data;
    } catch (error) {
        console.error('Amadeus Hotel Search Error:', error);
        throw error;
    }
};
