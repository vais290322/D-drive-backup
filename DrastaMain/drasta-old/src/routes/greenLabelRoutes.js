const express = require('express');
const router = express.Router();
const {
  createGreenLabel,
  getGreenLabels,
  deleteGreenLabel
} = require('../controller/greenLabelController');

// POST a new Green Label enquiry
router.post('/greenlabel', createGreenLabel);

// GET all Green Label submissions
router.get('/greenlabel', getGreenLabels);


// DELETE a Green Label submission by ID
router.delete('/greenlabel/:id', deleteGreenLabel);

module.exports = router;