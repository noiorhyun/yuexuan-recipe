import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Search recipes by name
 *     description: Returns recipes that match the search query
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('recipe_db');

    // Search for recipes where the name contains the query (case-insensitive)
    const recipes = await db.collection('recipes')
      .find({
        name: { $regex: query, $options: 'i' }
      })
      .toArray();

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
} 