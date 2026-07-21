const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const { addInternToYear, getInternYears , deleteInternFromYear} = require('../controller/internYearController');

router.post('/intern', upload.single('image'), addInternToYear);
router.get('/intern', getInternYears);
router.delete('/intern-year/:year/:internId', deleteInternFromYear);

module.exports = router;