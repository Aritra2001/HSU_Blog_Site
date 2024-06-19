const express = require('express');
const upload = require('../utility/cloudinary');
const { CreateProject, getAcceptedProjects, getPendingProjects, categoryFilter, getProject, updateProject} = require('../controllers/projectController')

const router = express.Router();

router.post('/createProject', upload, CreateProject);

router.get('/getAcceptedProjects', getAcceptedProjects);

router.get('/getPendingProjects', getPendingProjects);

router.get('/categoryFilterProjects', categoryFilter);

router.get('/getProject/:id', getProject);

router.patch('/updateProject/:id', updateProject)

module.exports = router;