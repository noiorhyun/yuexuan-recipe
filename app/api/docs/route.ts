import { NextResponse } from 'next/server';
import { swaggerSpec } from '../swagger';
import swaggerUi from 'swagger-ui-express';

export async function GET() {
  return NextResponse.json(swaggerSpec);
} 