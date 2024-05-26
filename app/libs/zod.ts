import z from "zod";

const cardNumberRegex = /^[0-9]{13,19}$/;
const cvcRegex = /^[0-9]{3,4}$/;
const expirationDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

const paymentInfoSchema = z.object({
  creditCardNumber: z.string().refine((value) => cardNumberRegex.test(value), {
    message: "Invalid credit card number",
  }),
  cvc: z.string().refine((value) => cvcRegex.test(value), {
    message: "Invalid CVC",
  }),
  expirationDate: z.string().refine(
    (value) => {
      if (!expirationDateRegex.test(value)) return false;

      const [_, month, year]: any = value.match(expirationDateRegex);
      const expiry = new Date(`20${year}-${month}-01`);
      const now = new Date();

      return expiry > now;
    },
    {
      message: "Invalid or expired expiration date",
    }
  ),
});

const ticketSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  ticketType: z.string(),
  ticketTypeDescription: z.string(),
});

const cartSchema = z.object({
  quantity: z.number(),
  ticket: ticketSchema,
});

export const paymentSchema = z.object({
  name: z.string().min(3, "Name should contain minimum 3 characters."),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().refine(
    (value) => {
      const phoneRegex = /\d{10}/;
      return phoneRegex.test(value);
    },
    {
      message: "Invalid phone number format. Expected format: 12345678910",
    }
  ),
  totalAmount: z.number(),
  age: z.number().min(1).max(99),
  paymentInfo: paymentInfoSchema,
  cart: z.array(cartSchema),
  rating: z
    .number()
    .min(1)
    .max(5, "Rating must be between 1 and 5.")
    .optional(),
  comment: z.string().optional(),
});
