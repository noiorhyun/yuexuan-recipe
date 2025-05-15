import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import clientPromise from '../../../../../lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { comment, imageUrl, rating } = await request.json();

    // Get the session cookie
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating is required and must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('recipe_db');

    // Get the user's username
    const user = await db.collection('users').findOne({
      _id: new ObjectId(session.value)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the review object with username
    const review = {
      comment: comment.trim(),
      date: new Date(),
      imageUrl: imageUrl || null,
      rating: rating,
      username: user.username
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { reviewIndex } = await request.json();

    // Get the session cookie
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (typeof reviewIndex !== 'number' || reviewIndex < 0) {
      return NextResponse.json(
        { error: 'Invalid review index' },
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

    // Get the recipe first to check if the review exists and belongs to the user
    const recipe = await db.collection('recipes').findOne({
      _id: new ObjectId(id)
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    if (!recipe.reviews || reviewIndex >= recipe.reviews.length) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the review belongs to the current user
    const review = recipe.reviews[reviewIndex];
    if (review.username !== user.username) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    // Remove the review at the specified index
    const result = await db.collection('recipes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $pull: { 
          reviews: recipe.reviews[reviewIndex]
        },
        $set: { 
          updatedAt: new Date() 
        }
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 