import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - name
 *         - ingredients
 *         - instructions
 *         - cookingTime
 *         - servings
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the recipe
 *         name:
 *           type: string
 *           description: The name of the recipe
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients needed for the recipe
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Step-by-step cooking instructions
 *         cookingTime:
 *           type: integer
 *           description: Cooking time in minutes
 *         servings:
 *           type: integer
 *           description: Number of servings the recipe makes
 *         category:
 *           type: array
 *           items:
 *             type: string
 *           description: List of categories for the recipe (e.g., ["Dinner", "Thai", "Spicy"])
 *         imageUrl:
 *           type: string
 *           description: URL to the recipe's image
 *         reviews:
 *           type: array
 *           items:
 *             type: integer
 *             minimum: 1
 *             maximum: 5
 *           description: Array of review ratings (1-5)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the recipe was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the recipe was last updated
 */

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     description: Returns a single recipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: A single recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('recipe_db');

    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(params.id)
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
} 

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('recipe_db');
    
    const result = await db.collection('recipes').deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Recipe deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     description: Update an existing recipe with new information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input or missing required fields
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('recipe_db');

    let updateOperation;
    let validationError = null;

    // Check if this request is just for adding a rating
    if (body.hasOwnProperty('newRating') && Object.keys(body).length === 1) {
      const newRating = body.newRating;
      if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
        validationError = { error: 'New rating must be an integer between 1 and 5', status: 400 };
      } else {
        updateOperation = {
          $push: { reviews: newRating },
          $set: { updatedAt: new Date() }
        };
        console.log('Adding new rating for ID:', id, 'Rating:', newRating);
      }
    } else {
      // Handle full recipe update (existing logic)
      // Validate required fields for full update
      if (!body.name || !body.ingredients || !body.instructions || !body.cookingTime || !body.servings) {
        validationError = { error: 'Missing required fields for full update', status: 400 };
      }
      // Validate reviews array if present in a full update
      if (!validationError && body.reviews && (!Array.isArray(body.reviews) || !body.reviews.every(r => Number.isInteger(r) && r >= 1 && r <= 5))) {
         validationError = { error: 'Reviews must be an array of integers between 1 and 5', status: 400 };
      }
      // Validate category array if present
       if (!validationError && body.category && !Array.isArray(body.category)) {
         validationError = { error: 'Category must be an array of strings', status: 400 };
       }
       
      if (!validationError) {
        updateOperation = {
          $set: {
            ...body,
            updatedAt: new Date()
          }
        };
        console.log('Updating full recipe for ID:', id, 'Data:', body);
      }
    }

    if (validationError) {
      return NextResponse.json({ error: validationError.error }, { status: validationError.status });
    }

    const result = await db.collection('recipes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateOperation,
      { returnDocument: 'after' } // returnNewDocument is deprecated
    );

    console.log('Update/Rating result:', JSON.stringify(result, null, 2));

    if (!result) {
      console.log('No recipe found with ID:', id);
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Return the updated document
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update recipe',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}