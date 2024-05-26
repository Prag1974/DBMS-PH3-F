import db from "@/app/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tableName: string } }
) {
  const { tableName } = params;

  let query = "";
  switch (tableName) {
    case "genderDistribution":
      query = `SELECT gender, COUNT(*) as count FROM attendant GROUP BY gender`;
      break;
    case "ageDistribution":
      query = `SELECT age, COUNT(*) as count FROM attendant GROUP BY age`;
      break;
    case "eventGenderDistribution":
      query = `SELECT e.name as event, a.gender, COUNT(*) as count 
      FROM event e 
      LEFT JOIN ticket t ON e.id = t.eventId 
      LEFT JOIN sale s ON t.id = s.ticketId 
      INNER JOIN attendant a ON s.attendantId = a.id 
      GROUP BY e.name, a.gender`;
      break;
    case "ticketTypeDistribution":
      query = `SELECT e.name as event, tt.ticketType as ticketType, COUNT(*) as count 
      FROM event e 
      JOIN ticket t ON e.id = t.eventId 
      JOIN sale s ON t.id = s.ticketId 
      JOIN tickettype tt ON t.ticketTypeId = tt.id 
      GROUP BY e.name, tt.ticketType`;
      break;
    case "eventAgeDistribution":
      query = `SELECT e.name as event, a.age, COUNT(*) as count 
               FROM event e 
               JOIN ticket t ON e.id = t.eventId 
               JOIN sale s ON t.id = s.ticketId 
               JOIN attendant a ON s.attendantId = a.id 
               GROUP BY e.name, a.age`;
      break;
    case "eventRevenueExpense":
      query = `SELECT e.name as event, 
               SUM(t.price) as revenue, ##income
               (SELECT SUM(ex.cost) FROM expenditure ex 
               JOIN eventexpenditurehascost eh ON ex.id = eh.expenditureId 
               WHERE eh.eventId = e.id) as expense ##expenditure 
               FROM event e
               JOIN ticket t ON e.id = t.eventId 
               JOIN sale s ON t.id = s.ticketId 
               GROUP BY e.name, e.id`;
      break;
    default:
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
  }

  try {
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
