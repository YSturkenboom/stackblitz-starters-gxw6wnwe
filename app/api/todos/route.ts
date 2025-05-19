import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '../../../utils/mongo';

/*
In this file, we are implementing the API endpoints for the todos.

Your tasks:
- Implement proper error handling and validation for all endpoints
- Immplement create endpoint
- Implement filter endpoint
*/
const Todos = getCollection('todos');

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const statuses = searchParams.get('statuses')?.split(',') || [];

  // TODO: Implement filter endpoint
  // TODO: Implement proper error handling and validation
  
  const todos = [{ foo: 'bar' }];
  return NextResponse.json({ success: true, data: todos }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Implement proper error handling and validation
  // TODO: Insert a new todo item into the database, and return the new todo item

  // Replace the placeholder with the actual result
  const result = { data: 'placeholder'};
  return NextResponse.json(
    { success: true, data: result.data },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  // TODO: Implement proper error handling and validation
  try {
    const body = await req.json();

    // TODO: Delete the todo item from the database, and return the deleted todo item

    // Replace the placeholder with the actual result
    const result = { data: 'placeholder' };
    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'OK' }, { status: 200 });
}
