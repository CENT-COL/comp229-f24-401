describe('Projects Page', () => {
    beforeEach(() => {
        // Visti the projects page for each test
        cy.visit('/projects')
    });

    it('should display a list of projects', () => {
        // Assert the page loads correctly
        cy.contains('Projects').should('be.visible') // Check the page title

        // Step 1: Intercept the API request
        cy.intercept('GET', '/api/projects').as('getProjects'); // Track the API call

        // Step 2: Wait for the API response
        cy.wait('@getProjects');

        // Verify that the project list is displayed
        cy.get('[data-cy="project-list"]').should('be.visible')
    });


    it('should display "No projects found" when the list is empty', () => {
        // Step 1: Mock the API response with an empty array
        cy.intercept('GET', '/api/projects', []).as('getProjects');

        // Step 2: Wait for the API to respond
        cy.wait('@getProjects');

        // Step 3: Assert that the empty state is displayed
        cy.contains('No projects available').should('be.visible'); // Replace with your empty state message
    });
})