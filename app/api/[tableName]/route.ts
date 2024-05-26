import { NextRequest, NextResponse } from "next/server";
import db from "@/app/libs/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const { tableName } = params;

  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName}`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const { tableName } = params;
  const body = await request.json();

  try {
    const [result] = await db.query(`INSERT INTO ${tableName} SET ?`, [body]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while inserting data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const { tableName } = params;
  const body = await request.json();
  const { id, ...data } = body;

  try {
    const [result] = await db.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [
      data,
      id,
    ]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const { tableName } = params;
  const { id } = await request.json();

  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while deleting data" },
      { status: 500 }
    );
  }
}
