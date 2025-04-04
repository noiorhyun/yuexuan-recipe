import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *         cookingTime:
 *           type: integer
 *         servings:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await connectToDatabase();
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