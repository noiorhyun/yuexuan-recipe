import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { comment, imageUrl } = await request.json();

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('recipe_db');

    // Create the review object
    const review = {
      comment: comment.trim(),
      date: new Date(),
      imageUrl: imageUrl || null
    };

    // Update the recipe with the new review
    const result = await db.collection('recipes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $push: { 
          reviews: review 
        },
        $set: { 
          updatedAt: new Date() 
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
} 