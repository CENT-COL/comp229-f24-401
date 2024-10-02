const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects'); 
const authMiddleware = require('../middlewares/auth');

//define the CRUD api routes 
// CRUD => REST API Using GET, POST, PUT, DELETE HTTP verbs

// GET /projects (Read all projects)
router.get('/', projectController.getAllProjects);

// GET /projects/:id (Read a project by ID)
router.get('/:id', projectController.getProjectById);

// POST /projects (Create a new project)
router.post('/', authMiddleware, projectController.createProject);

// PUT /projects/:id (Update a project)
router.put('/:id', authMiddleware, projectController.updateProject);

// DELETE /projects/:id (Delete a project)
router.delete('/:id',authMiddleware,  projectController.deleteProject);

module.exports = router;