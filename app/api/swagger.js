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
      description: 'API for managing recipes and user authentication',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Current server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            username: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        UserInput: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username for the new user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user'
            },
            password: {
              type: 'string',
              description: 'Password for the user account'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['identifier', 'password'],
          properties: {
            identifier: {
              type: 'string',
              description: 'Username or email of the user'
            },
            password: {
              type: 'string',
              description: 'Password for the user account'
            }
          }
        },
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
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          description: 'Creates a new user account with the provided credentials',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserInput'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            400: {
              description: 'Invalid input or user already exists',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'User with this email or username already exists'
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
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Login user',
          description: 'Authenticates a user with their credentials',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginInput'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            400: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Invalid username/email or password'
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
        }
      },
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
        },
        delete: {
          summary: 'Delete a recipe by ID',
          description: 'Deletes a single recipe',
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
              description: 'Recipe deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Recipe deleted successfully'
                      }
                    }
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
        },
        put: {
          summary: 'Update a recipe by ID',
          description: 'Updates an existing recipe',
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
            200: {
              description: 'Recipe updated successfully',
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
  apis: ['./app/api/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;