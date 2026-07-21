const express = require('express');
const router = express.Router();
const { createTitle, getTitles, getTitleById, updateTitle, deleteTitle } = require('../controller/title.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create Title (admin only)
router.post('/addheading', authenticate, authorize(["admin","staff"]), createTitle);

// Get all Titles (public)
router.get('/getheading', getTitles);

// Get single Title (public)
router.get('/getheadingbyid/:id', getTitleById);

// Update Title (admin only)
router.put('/updateheading/:id', authenticate, authorize(["admin","staff"]), updateTitle);

// Delete Title (admin only)
router.delete('/:id', authenticate, authorize(["admin","staff"]), deleteTitle);

module.exports = router;