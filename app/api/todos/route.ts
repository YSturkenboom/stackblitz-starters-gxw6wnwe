import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '../../../utils/mongo';

const Todos = getCollection('todos');

export async function GET() {
  const todos = await Todos.find().toArray();
  return NextResponse.json({ success: true, data: todos }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.text) {
    return NextResponse.json(
      { success: false, message: 'Missing text' },
      { status: 400 }
    );
  }

  const result = await Todos.insertOne({
    text: body.text,
    completed: false,
  });
  return NextResponse.json(
    { success: true, data: result.data },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json(
      { success: false, message: 'Missing id' },
      { status: 400 }
    );
  }

  const result = await Todos.updateOne(
    { _id: body.id },
    { $set: { completed: body.completed } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { success: false, message: 'Todo not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: result.data },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.text();
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Missing body' },
        { status: 400 }
      );
    }

    const { id } = JSON.parse(body);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing id' },
        { status: 400 }
      );
    }

    const result = await Todos.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON or missing body' },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'OK' }, { status: 200 });
}
