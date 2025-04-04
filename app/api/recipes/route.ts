import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeInput:
 *       type: object
 *       required:
 *         - name
 *         - ingredients
 *         - instructions
 *         - cookingTime
 *         - servings
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the recipe
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Step-by-step instructions
 *         cookingTime:
 *           type: integer
 *           description: Cooking time in minutes
 *         servings:
 *           type: integer
 *           description: Number of servings
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Returns a list of all recipes
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new recipe
 *     description: Add a new recipe to the collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db('recipe_db');
    const recipes = await db.collection('recipes').find({}).toArray();
    
    return NextResponse.json({ recipes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.ingredients || !body.instructions || !body.cookingTime || !body.servings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db('recipe_db');
    
    const result = await db.collection('recipes').insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const newRecipe = {
      _id: result.insertedId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
} 