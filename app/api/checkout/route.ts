import { ResultSetHeader } from "mysql2";
import db from "../../libs/db";

interface CartItem {
  quantity: number;
  ticket: {
    id: number;
    name: string;
    price: number;
    ticketType: string;
    ticketTypeDescription: string;
  };
}
interface ReqBody {
  name: string;
  gender: string;
  age: number;
  phoneNumber: string;
  cart: CartItem[];
  totalAmount: number;
  rating?: number;
  comment?: string;
  paymentInfo: {
    creditCardNumber: string;
    expirationDate: string;
    cvc: string;
  };
}

interface Attendant {
  id: number;
  fullName: string;
  age: number;
  gender: "M" | "F";
  phoneNumber: string;
}

interface Sale {
  id: number;
  dateOfSale: Date;
  isPaid: number;
  attendantId: number;
  ticketId: number;
}
export async function POST(req: Request) {
  try {
    const {
      name,
      gender,
      age,
      phoneNumber,
      cart,
      totalAmount,
      rating,
      comment,
      paymentInfo: { cvc, expirationDate, creditCardNumber },
    }: ReqBody = await req.json();

    let currentUser: Attendant;
    let sale: Sale;

    let [existingUser]: [any[], any] = await db.query(
      `Select a.id, a.fullName, a.age,a.gender,a.phoneNumber from attendant a WHERE fullName = ? AND gender = ? AND phoneNumber = ?`,
      [name, gender == "Male" ? "M" : "F", phoneNumber]
    );

    currentUser = existingUser.at(0) satisfies Attendant;

    if (existingUser.length == 0) {
      const [newUser] = await db.query(
        `INSERT INTO attendant (fullName,age,gender,phoneNumber) VALUES(?,?,?,?)`,
        [name, age, gender == "Male" ? "M" : "F", phoneNumber]
      );
      const [createdUser]: [any[], any] = await db.query(
        `SELECT * from attendant WHERE id = ?`,
        [(newUser as ResultSetHeader).insertId]
      );

      currentUser = createdUser.at(0) satisfies Attendant;
    }

    for (const cartItem of cart) {
      for (let i = 0; i < cartItem.quantity; i++) {
        const [saleInsertResult] = await db.query(
          `INSERT INTO sale (isPaid, attendantId, ticketId) VALUES (1,?,?)`,
          [currentUser.id, cartItem.ticket.id]
        );
        const [result]: [any[], any] = await db.query(
          `SELECT * from sale WHERE id = ?`,
          [(saleInsertResult as ResultSetHeader).insertId]
        );
        sale = result.at(0) satisfies Sale;
        await db.query(
          `INSERT INTO saleaddresssoldon (saleId, addressId) VALUES (?, 5)`,
          [sale.id]
        );
      }
    }
    const [insertedConsider] = await db.query(
      `INSERT INTO consider (consider,comment) VALUES (?,?)`,
      [rating, comment]
    );
    await db.query(
      `INSERT INTO saleconsiderevaluate (saleId,considerId) VALUES (?,?)`,
      [sale!.id, (insertedConsider as ResultSetHeader).insertId]
    );
    return Response.json("doen");
  } catch (err) {
    return Response.json({ error: err });
  }
}
