import express from 'express';
import { searchFlightsController, searchHotelsController, searchAirportsController } from '../controller/amadeusController.js';

const router = express.Router();

router.get('/flights/search', searchFlightsController);
router.get('/hotels/search', searchHotelsController);
router.get('/flights/airport', searchAirportsController);

export default router;
