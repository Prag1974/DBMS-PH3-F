import db from "@/app/libs/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { eventId: string } },
  res: NextApiResponse
) {
  const { eventId } = params;

  if (!eventId || typeof eventId !== "string") {
    return res.status(400).json({ message: "Invalid eventId" });
  }

  try {
    const [eventDetails]: any = await db.execute(
      `SELECT 
        e.name AS eventName,
        e.description AS eventDescription,
        e.startDate,
        e.endDate,
        e.maxAttendant,
        (e.maxAttendant - COUNT(s.id)) AS remainingTickets,
        c.name AS companyName,
        c.description AS companyDescription
      FROM 
        event e
      LEFT JOIN 
        company c ON e.companyId = c.id
      LEFT JOIN 
        ticket t ON e.id = t.eventId
      LEFT JOIN 
        sale s ON t.id = s.ticketId
      WHERE 
        e.id = ?
      GROUP BY 
        e.id, c.id;`,
      [eventId]
    );

    const [tickets]: any = await db.execute(
      `SELECT 
        t.id,
        t.name,
       t.price AS price,
        tt.ticketType,
        tt.description AS ticketTypeDescription
      FROM 
        ticket t
     LEFT JOIN 
        tickettype tt ON t.ticketTypeId = tt.id
      WHERE 
        t.eventId = ?;`,
      [eventId]
    );

    const formattedTickets = tickets.map((ticket: any) => ({
      ...ticket,
      price: parseFloat(ticket.price),
    }));

    return Response.json({
      eventDetails: eventDetails[0],
      tickets: formattedTickets,
    });
  } catch (e) {
    return Response.json({ message: "Server error", e });
  }
}
