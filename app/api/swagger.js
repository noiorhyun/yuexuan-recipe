import swaggerJsdoc from 'swagger-jsdoc';

const serverUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe API',
      version: '1.0.0',
      description: 'API for managing recipes',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Current server',
      },
    ],
  },
  apis: ['./app/api/**/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;