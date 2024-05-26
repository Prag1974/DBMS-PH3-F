import db from "@/app/libs/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { tableName: string } }
) {
  const tableName = params.tableName;

  try {
    const [rows] = await db.query(`SELECT * FROM ??`, [tableName]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
