import axios from 'axios';
import { searchFlights, searchHotels } from '../services/amadeusService.js';

/**
 * Search Airports (Cities) by keyword using Amadeus API
 */
export const searchAirportsController = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: 'Missing required parameter: keyword' });
        }

        const tokenRes = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_CLIENT_ID || '',
                client_secret: process.env.AMADEUS_CLIENT_SECRET || '',
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const accessToken = tokenRes.data.access_token;

        const apiRes = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/cities', {
            params: { keyword, max: 50 },
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.json(apiRes.data);
    } catch (error) {
        console.error('Airport Search Controller Error:', error?.response?.data || error);
        res.status(500).json({ error: 'Failed to search airports' });
    }
};

/**
 * Search Flights
 */
export const searchFlightsController = async (req, res) => {
    try {
        const { origin, destination, date, adults } = req.query;

        if (!origin || !destination || !date) {
            return res.status(400).json({ error: 'Missing required parameters: origin, destination, date' });
        }

        const results = await searchFlights(
            origin,
            destination,
            date,
            Number(adults) || 1
        );

        res.json(results);
    } catch (error) {
        console.error('Flight Search Controller Error:', error);
        res.status(500).json({ error: 'Failed to search flights' });
    }
};

export const searchHotelsController = async (req, res) => {
    console.log('Received hotel search request with query:', req.query);
    try {
        const { cityCode } = req.query;

        if (!cityCode) {
            return res.status(400).json({ error: 'Missing required parameter: cityCode' });
        }

        const tokenRes = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_CLIENT_ID || 'ruFN67bwvSYoIYrTGnoCidozT1lujU7h',
                client_secret: process.env.AMADEUS_CLIENT_SECRET || 'zQfGPAOr1DZAV7Xk',
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const accessToken = tokenRes.data.access_token;

        const apiRes = await axios.get(
            'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
            {
                params: { cityCode },
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        res.json(apiRes.data);
    } catch (error) {
        console.error('Hotel Search Controller Error:', error?.response?.data || error);
        res.status(500).json({ error: 'Failed to search hotels' });
    }
};
