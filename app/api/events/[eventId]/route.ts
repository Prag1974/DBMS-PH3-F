import db from "@/app/libs/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { eventId: string } },
  res: NextApiResponse
) {
  const { eventId } = params;
  console.log(eventId);

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
      ad.country,
      ad.city,
      ad.state,
      ad.district,
      ad.street,
      ad.description AS addressDescription,
      c.name AS companyName,
      c.description AS companyDescription
      FROM 
       event e
      LEFT JOIN 
       eventplaceon epo ON e.id = epo.eventId
      LEFT JOIN 
        place p ON epo.placeId = p.id
      LEFT JOIN 
        placeaddresslocatedon pal ON p.id = pal.placeId
      LEFT JOIN 
        address ad ON pal.addressId = ad.id
      LEFT JOIN 
        company c ON e.companyId = c.id
      LEFT JOIN 
        ticket t ON e.id = t.eventId
      LEFT JOIN 
        sale s ON t.id = s.ticketId
      WHERE 
        e.id = ?
      GROUP BY 
        e.id, ad.id, c.id;`,
      [eventId]
    );

    const [employees] = await db.execute(
      `SELECT 
          emp.name AS employeeName,
          r.role AS employeeRole
        FROM 
          eventemployeeworksfor eew
        LEFT JOIN 
          employee emp ON eew.employeeId = emp.id
        LEFT JOIN 
          employeerolehasrole er ON emp.id = er.employeeId
        LEFT JOIN 
          role r ON er.roleId = r.id
        WHERE 
          eew.eventId = ? AND r.role IS NOT NULL
          `,
      [eventId]
    );

    // Event değerlendirmeleri
    const [reviews] = await db.execute(
      `SELECT 
          att.fullname AS considererName,
          c.consider AS rating,
          c.comment AS comment,
          sa.dateOfSale AS reviewDate
        FROM 
          saleconsiderevaluate s
        LEFT JOIN 
          consider c ON s.considerId = c.id
        LEFT JOIN 
          sale sa ON s.saleId = sa.id
        LEFT JOIN 
          attendant att ON sa.attendantId = att.id
        LEFT JOIN 
          ticket t ON sa.ticketId = t.id
        WHERE 
          t.eventId = ?
        ORDER BY 
          sa.dateOfSale DESC;`,
      [eventId]
    );

    return Response.json({
      ...eventDetails[0],
      employees,
      reviews,
    });
  } catch (e) {
    return Response.json({ message: "Server error", e });
  }
}
