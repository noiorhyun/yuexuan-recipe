import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

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
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, ingredients, instructions, cookingTime, servings, category, imageUrl, videoUrl } = body;

    // Validate required fields
    if (!name || !ingredients || !instructions || !cookingTime || !servings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('recipe_db');

    // Get the current user
    const user = await db.collection('users').findOne({
      _id: new ObjectId(session.value)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the recipe with author information
    const recipe = {
      name,
      ingredients,
      instructions,
      cookingTime,
      servings,
      category: category || [],
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      authorId: user._id,
      authorName: user.username,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('recipes').insertOne(recipe);

    if (!result.insertedId) {
      throw new Error('Failed to insert recipe');
    }

    // Fetch the complete recipe after insertion to ensure all fields are present
    const createdRecipe = await db.collection('recipes').findOne({
      _id: result.insertedId
    });

    if (!createdRecipe) {
      throw new Error('Failed to retrieve created recipe');
    }

    return NextResponse.json(createdRecipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe', details: error.message },
      { status: 500 }
    );
  }
} 