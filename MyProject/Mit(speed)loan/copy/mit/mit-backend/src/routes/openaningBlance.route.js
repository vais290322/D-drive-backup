const express = require('express');
const router = express.Router();
const { getOpeningBalance, createOpeningBalance, } = require('../controllers/openaningBlance.controller.js');



router.get('/get', getOpeningBalance);
router.post('/create', createOpeningBalance);

module.exports = router;
