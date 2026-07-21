
import express from 'express';
import { searchFlightsController, searchHotelsController } from '../controllers/amadeusController';

const router = express.Router();


import { searchAirportsController } from '../controllers/amadeusController';

router.get('/flights/search', searchFlightsController);
router.get('/hotels/search', searchHotelsController);
router.get('/flights/airport', searchAirportsController);

export default router;
