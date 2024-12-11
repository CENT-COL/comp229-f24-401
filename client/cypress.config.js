import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
      baseUrl: "http://localhost:5173",
      supportFile: false, // Optional: Disable default support file
      setupNodeEvents(on, config) {
        // implement node event listeners here
      },
    },
  });