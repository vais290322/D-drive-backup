
import { Request, Response } from 'express';

import { searchFlights, searchHotels } from '../services/amadeusService';
import axios from 'axios';
/**
 * Search Airports (Cities) by keyword using Amadeus API
 */
export const searchAirportsController = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: 'Missing required parameter: keyword' });
        }

        // Get access token from Amadeus (should be cached in production)
        const tokenRes = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_CLIENT_ID || '',
                client_secret: process.env.AMADEUS_CLIENT_SECRET || ''
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const accessToken = tokenRes.data.access_token;

        // Call Amadeus API for city/airport search
        const apiRes = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/cities', {
            params: {
                keyword,
                max: 50
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(apiRes.data);
    } catch (error: any) {
        console.error('Airport Search Controller Error:', error?.response?.data || error);
        res.status(500).json({ error: 'Failed to search airports' });
    }
};

/**
 * Search Flights
 */
export const searchFlightsController = async (req: Request, res: Response) => {
    try {
        const { origin, destination, date, adults } = req.query;

        if (!origin || !destination || !date) {
            return res.status(400).json({ error: 'Missing required parameters: origin, destination, date' });
        }

        const results = await searchFlights(
            origin as string,
            destination as string,
            date as string,
            Number(adults) || 1
        );

        res.json(results);
    } catch (error: any) {
        console.error('Flight Search Controller Error:', error);
        res.status(500).json({ error: 'Failed to search flights' });
    }
};


export const searchHotelsController = async (req: Request, res: Response) => {
    try {
        const { cityCode } = req.query;

        if (!cityCode) {
            return res.status(400).json({ error: 'Missing required parameter: cityCode' });
        }

        const results = await searchHotels(cityCode as string);

        res.json(results);
    } catch (error: any) {
        console.error('Hotel Search Controller Error:', error);
        res.status(500).json({ error: 'Failed to search hotels' });
    }
};
