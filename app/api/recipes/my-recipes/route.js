import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    // Get the session cookie
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
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

    // Find all recipes published by the user
    const recipes = await db.collection('recipes')
      .find({ authorId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
} 