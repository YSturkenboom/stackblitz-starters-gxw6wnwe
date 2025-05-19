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

  console.log('POST', body);

  const result = await Todos.insertOne({
    text: body.text,
    completed: false,
    status: body.status || 'not_started',
  });
  return NextResponse.json(
    { success: true, data: result.data },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.orders) {
      // Handle bulk order update
      const updates = Object.entries(body.orders).map(([id, order]) => ({
        filter: { _id: id },
        update: { $set: { order } }
      }));

      const results = await Promise.all(
        updates.map(({ filter, update }) => Todos.updateOne(filter, update))
      );

      return NextResponse.json(
        { success: true, data: results },
        { status: 200 }
      );
    }

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Missing id' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof body.completed !== 'undefined') {
      updateData.completed = body.completed;
    }
    if (body.status) {
      updateData.status = body.status;
    }

    const result = await Todos.updateOne(
      { _id: body.id },
      { $set: updateData }
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
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Missing id' },
        { status: 400 }
      );
    }

    const result = await Todos.deleteOne({ _id: body.id });
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
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'OK' }, { status: 200 });
}
