const express = require('express');
const upload = require('../utility/cloudinary');

const router = express.Router();

router.post('/createAudioBook', upload, () => {});

router.get('/getAcceptedAudioBook', () => {});

router.get('/getPendingAudioBook', () => {});

router.get('/categoryFilter', () => {});

router.get('/getAudioBook/:id', () => {});

router.patch('/updateAudioBook/:id', () => {});

module.exports = router;