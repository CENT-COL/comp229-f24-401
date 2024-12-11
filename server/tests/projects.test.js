// Description: Test cases for projects routes. Path: server/tests/projects.test.js
const request  = require('supertest');
const app = require('../app');

describe('GET /api/projects', () => {
    it("should return a list of projects", async () => {
        const response = await request(app).get('/api/projects');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
