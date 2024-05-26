import { NextApiResponse } from "next";
import db from "../../libs/db";

export async function POST(req: Request, res: NextApiResponse) {
  const { email, password } = await req.json();
  console.log("fired");
  console.log(email, password);
  try {
    const [rows]: any[] = await db.query(
      "SELECT * FROM role WHERE email = ? AND password = ?",
      [email, password]
    );
    const user = rows[0];
    if (user) {
      return Response.json(user);
    } else {
      return Response.json({ message: "Bad credantials" }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ message: "Server error", error }, { status: 500 });
  }
}
