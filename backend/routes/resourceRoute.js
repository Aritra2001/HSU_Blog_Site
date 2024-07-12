const express = require('express');
const upload = require('../utility/cloudinary');
const { CreateResource, getAcceptedResoures, getPendingResources, categoryFilter, getResouce, updateResource, addLikes, getpopularResources } = require('../controllers/resourceController')


const router = express.Router();

router.post('/createResource', upload, CreateResource);

router.get('/getAcceptedResources', getAcceptedResoures);

router.get('/getPendingResources', getPendingResources);

router.post('/categoryFilter', categoryFilter);

router.get('/getResource/:id', getResouce);

router.patch('/updateResource/:id', updateResource);

router.post('/resourcelikes/:id', addLikes);

router.get('/getpopularResource', getpopularResources);

module.exports = router;