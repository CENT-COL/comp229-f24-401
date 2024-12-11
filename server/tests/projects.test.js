// Description: Test cases for projects routes. Path: server/tests/projects.test.js
const mockingoose = require('mockingoose');
const Project = require('../models/projects');
const request  = require('supertest');
const app = require('../app');

describe('GET /api/projects', () => {
    it("should return a list of projects", async () => {

        const mockProjects = [
            {_id: '1', name: 'Project 1', description: 'Description 1', startDate: '2021-01-01', endDate: '2021-01-31'},
            {_id: '2', name: 'Project 2', description: 'Description 2', startDate: '2021-02-01', endDate: '2021-02-28'},
        ];

        mockingoose.Project.toReturn(mockProjects, 'find');

        const response = await request(app).get('/api/projects');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(2);
    });
});
