describe('Projects Page', () => {
    // Arrange
    beforeEach(() => {
        cy.visit('/projects')
    });

    it('should display a list of projects', () => {
        // Assert
        cy.contains('Projects').should('be.visible') // Check the page title

        cy.intercept('GET', '/api/projects').as('getProjects') // Track API call

        cy.wait('@getProjects'); // Wait for the API call to complete

        cy.get('[data-cy=project-list]').should('be.visible') // Check the project list table
    });

    it('should display "No projects found" when the list is empty', () => {
        // Step 1: Mock the API response with an empty array
        cy.intercept('GET', '/api/projects', []).as('getProjects');

        // Step 2: Wait for the API to respond
        cy.wait('@getProjects');

        // Step 3: Assert that the empty state is displayed
        cy.contains('No projects available').should('be.visible'); // Replace with your empty state message
    });
});