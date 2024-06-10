const express = require('express');
const upload = require('../utility/cloudinary');
const { createAudioBook, categoryFilter, getAudioBooks, getAudioBook } = require('../controllers/audioBookController')

const router = express.Router();

router.post('/createAudioBook', upload, createAudioBook);

router.get('/getAudioBooks', getAudioBooks);

router.get('/categoryFilteraudiobook', categoryFilter);

router.get('/getAudioBook/:id', getAudioBook);

module.exports = router;