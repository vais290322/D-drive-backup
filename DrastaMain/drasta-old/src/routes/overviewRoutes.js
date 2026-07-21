const express = require('express');
const router = express.Router();
const {
  createOverview,
  getAllOverviews,
  getOverviewById,
  updateOverview,
  deleteOverview
} = require('../controller/overviewController');

router.post('/overview', createOverview);
router.get('/overview', getAllOverviews);
router.get('/overview/:id', getOverviewById);
router.put('/overview/:id', updateOverview);
router.delete('/overview/:id', deleteOverview);

module.exports = router;
