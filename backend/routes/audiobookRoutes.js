const express = require('express');
const upload = require('../utility/cloudinary');
const { createAudioBook, categoryFilter, getAudioBooks, getAudioBook, addLikes, getpopularAudiobooks, deleteAudiobook, editAudioBook, searchAudioBooks } = require('../controllers/audioBookController')

const router = express.Router();

router.post('/createAudioBook', upload, createAudioBook);

router.get('/getAudioBooks', getAudioBooks);

router.post('/categoryFilteraudiobook', categoryFilter);

router.get('/getAudioBook/:id', getAudioBook);

router.post('/audiobooklikes/:id', addLikes);

router.get('/getpopularAudiobook', getpopularAudiobooks);

router.patch('/editAudiobook/:id',upload, editAudioBook);

router.delete('/deleteAudiobook/:id', deleteAudiobook);

router.post('/findaudiobooks', searchAudioBooks)

module.exports = router;