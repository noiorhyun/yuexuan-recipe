import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

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
 *     summary: Get recipes
 *     description: Returns a list of recipes, optionally filtered by category or search query.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter recipes by a specific category (case-insensitive).
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Search recipes by name or ingredients.
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
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('recipe_db');
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('q');

    let query = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { ingredients: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    console.log("Executing recipe query:", query);
    const recipes = await db.collection('recipes').find(query).toArray();
    
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.ingredients || !body.instructions || !body.cookingTime || !body.servings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
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