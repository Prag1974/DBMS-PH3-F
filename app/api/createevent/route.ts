import db from "@/app/libs/db";
import { ResultSetHeader } from "mysql2";
interface BodyInterface {
  companyId: number;
  employees: {
    id: number;
    name: string;
    description: string;
    age: number;
    gender: "M" | "F";
    dailySalary: number;
    phoneNumber: string;
  }[];
  event: {
    description: string;
    endDate: string | Date;
    startDate: string | Date;
    name: string;
    maxAttendant: number;
  };
  expenditures: {
    name: string;
    description: string;
    cost: number;
    purchaseDate: string | Date;
  }[];
  places: { id: number; name: string; description: string }[];
  tickets: {
    name: string;
    price: string | number;
    description: string;
    ticketType:
      | "normal_ticket"
      | "vip_ticket"
      | "student_ticket"
      | "group_ticket"
      | "early_bird_ticket"
      | "free_ticket"
      | "ultimate_vip_ticket"
      | "family_ticket"
      | "standard_plus_ticket"
      | "booth_rental_ticket";
  }[];
}
export async function POST(req: Request, res: Response) {
  const {
    companyId,
    expenditures,
    event,
    tickets,
    places,
    employees,
  }: BodyInterface = (await req.json()) satisfies BodyInterface;
  try {
    const [eventInsertRow]: [ResultSetHeader, any] = await db.query(
      "INSERT INTO event SET ?, companyId = ?",
      [event, companyId]
    );
    for (const expediture of expenditures) {
      const [expenditureInsertRow]: [ResultSetHeader, any] = await db.query(
        "INSERT INTO expenditure SET ?",
        [expediture]
      );
      const [expenditureRelationalInsertRow]: [ResultSetHeader, any] =
        await db.query(
          "INSERT INTO eventexpenditurehascost (expenditureId, eventId) VALUES (?, (SELECT id FROM event WHERE event.name = ?))",
          [expenditureInsertRow.insertId, event.name]
        );
    }

    for (const employee of employees) {
      const [employeeRelationalInsertRow]: [ResultSetHeader, any] =
        await db.query(
          "INSERT INTO eventemployeeworksfor (eventId, employeeId) VALUES ((SELECT id FROM event WHERE event.name = ?),?)",
          [event.name, employee.id]
        );
    }

    for (const place of places) {
      const [placeRelationalInsertRow]: [ResultSetHeader, any] = await db.query(
        "INSERT INTO eventplaceon (eventId, placeId) VALUES ((SELECT id FROM event WHERE event.name = ?), ?)",
        [event.name, place.id]
      );
    }

    for (const ticket of tickets) {
      const [ticketTypeInsertRow]: [ResultSetHeader, any] = await db.query(
        "INSERT INTO tickettype (ticketType, description) VALUES(?,?)",
        [ticket.ticketType, ticket.description]
      );
      const [ticketInsertRow]: [ResultSetHeader, any] = await db.query(
        "INSERT INTO ticket (name, price, ticketTypeId,eventId) VALUES(?,?,?,(SELECT id FROM event WHERE event.name = ?))",
        [ticket.name, ticket.price, ticketTypeInsertRow.insertId, event.name]
      );
    }
    return Response.json(eventInsertRow.insertId);
  } catch (error) {
    return Response.json(error);
  }
}
