const express = require('express');
const router = express.Router();
const {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
} = require('../controller/newsController');

// POST    /api/v1/news        → createNews
router.post('/news', createNews);

// GET     /api/v1/news        → getNews
router.get('/news', getNews);

// GET     /api/v1/news/:id    → getNewsById
router.get('/news/:id', getNewsById);

// PUT     /api/v1/news/:id    → updateNews
router.put('/news/:id', updateNews);

// DELETE  /api/v1/news/:id    → deleteNews
router.delete('/news/:id', deleteNews);

module.exports = router;