import db from "../libs/db";
import { Event, EventFromDB } from "../libs/types";

const query = `
SELECT e.*, AVG(c.consider) AS average_consider, 
COUNT(c.id) AS consider_count, (e.maxAttendant - COUNT(s.id)) AS remainingTickets
FROM event e
##Getting all relevant sales
LEFT JOIN ticket t ON e.id = t.eventId ##This event's ticket
LEFT JOIN sale s ON t.id = s.ticketId ## This event's sale
##Getting evaluates
LEFT JOIN saleconsiderevaluate sce ON s.id = sce.saleId ##This events's evaluates
LEFT JOIN consider c ON sce.considerId = c.id ##This events considers
GROUP BY e.id
`;

export async function GET() {
  const [rows] = await db.query(query);
  const events: EventFromDB[] = rows as EventFromDB[];
  return Response.json(rows);
}
