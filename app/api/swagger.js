import swaggerJsdoc from 'swagger-jsdoc';

const serverUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

// Define your API documentation directly in the options
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
    components: {
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            instructions: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            cookingTime: {
              type: 'integer'
            },
            servings: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RecipeInput: {
          type: 'object',
          required: ['name', 'ingredients', 'instructions', 'cookingTime', 'servings'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the recipe'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of ingredients'
            },
            instructions: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Step-by-step instructions'
            },
            cookingTime: {
              type: 'integer',
              description: 'Cooking time in minutes'
            },
            servings: {
              type: 'integer',
              description: 'Number of servings'
            }
          }
        }
      }
    },
    paths: {
      '/api/recipes': {
        get: {
          summary: 'Get all recipes',
          description: 'Returns a list of all recipes',
          responses: {
            200: {
              description: 'A list of recipes',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      recipes: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Recipe'
                        }
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: 'Server error'
            }
          }
        },
        post: {
          summary: 'Create a new recipe',
          description: 'Add a new recipe to the collection',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RecipeInput'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Recipe created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Recipe'
                  }
                }
              }
            },
            400: {
              description: 'Invalid input'
            },
            500: {
              description: 'Server error'
            }
          }
        }
      },
      '/api/recipes/{id}': {
        get: {
          summary: 'Get a recipe by ID',
          description: 'Returns a single recipe',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'Recipe ID'
            }
          ],
          responses: {
            200: {
              description: 'A single recipe',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Recipe'
                  }
                }
              }
            },
            404: {
              description: 'Recipe not found'
            },
            500: {
              description: 'Server error'
            }
          }
        }
      }
    }
  },
  apis: [] // We're not using file-based API documentation anymore
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;