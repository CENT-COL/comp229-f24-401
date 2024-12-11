const request = require('supertest');
const mockingoose = require('mockingoose');
const Project = require('../models/projects');
const app = require('../app');

describe('GET /api/projects', () =>{
    it('should return a list of projects', async () => {
        // AAA Pattern

        // Arrange
        const mockProjects = [
            {_id: '507f191e810c19729de860ea', name: 'Project 1', description: 'Description 1', startDate: '2021-01-01', endDate: '2021-01-31'},
            {_id: '507f191e810c19729de860eb', name: 'Project 2', description: 'Description 2', startDate: '2021-02-01', endDate: '2021-02-28'},
            {_id: '507f191e810c19729de860ec', name: 'Project 3', description: 'Description 3', startDate: '2021-03-01', endDate: '2021-03-31'}
        ]

        mockingoose.Project.toReturn(mockProjects, 'find');

        // Act
        const response  = await request(app).get('/api/projects');

        // Assert
        expect(response.status).toBe(200); // 200 OK
        expect(response.body).toBeInstanceOf(Array); // Array
        expect(response.body).toHaveLength(3); // 3 items
    })
})