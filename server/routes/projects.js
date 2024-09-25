const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects'); 
//define the CRUD api routes 
// CRUD => REST API Using GET, POST, PUT, DELETE HTTP verbs

// GET /projects (Read all projects)
router.get('/', projectController.getAllProjects);

// GET /projects/:id (Read a project by ID)
router.get('/:id', projectController.getProjectById);

// POST /projects (Create a new project)
router.post('/', projectController.createProject);

// PUT /projects/:id (Update a project)
router.put('/:id', projectController.updateProject);

// DELETE /projects/:id (Delete a project)
router.delete('/:id', projectController.deleteProject);

module.exports = router;