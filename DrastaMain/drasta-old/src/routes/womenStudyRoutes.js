const express = require('express');
const router = express.Router();
const {
  createWomenStudy,
  getWomenStudies,
  deleteWomenStudy
} = require('../controller/womenStudyController');

// Create new entry
router.post('/womenstudy', createWomenStudy);
// Get all entries
router.get('/womenstudy', getWomenStudies);
// Delete an entry
router.delete('/womenstudy/:id', deleteWomenStudy);

module.exports = router;