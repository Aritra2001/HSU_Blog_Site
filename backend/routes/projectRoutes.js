const express = require('express');
const upload = require('../utility/cloudinary');
const { CreateProject, getAcceptedProjects, getPendingProjects, categoryFilter, getProject, updateProject, addLikes, getpopularProjects, searchProjects} = require('../controllers/projectController')

const router = express.Router();

router.post('/createProject', upload, CreateProject);

router.get('/getAcceptedProjects', getAcceptedProjects);

router.get('/getPendingProjects', getPendingProjects);

router.post('/categoryFilterProjects', categoryFilter);

router.get('/getProject/:id', getProject);

router.patch('/updateProject/:id', updateProject);

router.post('/projectslikes/:id', addLikes);

router.get('/getpopularProjects', getpopularProjects);

router.post('/searchProject', searchProjects);

module.exports = router;