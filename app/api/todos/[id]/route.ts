import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '../../../../utils/mongo';

const Todos = getCollection('todos');

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
} 