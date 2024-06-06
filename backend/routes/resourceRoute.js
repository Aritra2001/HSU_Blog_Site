const express = require('express');
const upload = require('../utility/cloudinary')
const { CreateResource, getAcceptedResoures, getPendingResources } = require('../controllers/resourceController')


const router = express.Router();

router.post('/createResource', upload, CreateResource);

router.get('/getAcceptedResources', getAcceptedResoures);

router.get('/getPendingResources', getPendingResources);

module.exports = router;