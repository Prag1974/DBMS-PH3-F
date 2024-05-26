/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

interface EventDetails {
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  maxAttendant: number;
  remainingTickets: number;
  companyName: string;
  companyDescription: string;
}

interface Ticket {
  id: number;
  name: string;
  price: string;
  ticketType: string;
  ticketTypeDescription: string;
}

interface CartItem {
  ticket: Ticket;
  quantity: number;
}

const ticketEmojis = {
  normal_ticket: "🎟️",
  vip_ticket: "🎫",
  student_ticket: "🎓",
  group_ticket: "👥",
  early_bird_ticket: "🌅",
  free_ticket: "🆓",
  ultimate_vip_ticket: "🌟",
  family_ticket: "👪",
  standard_plus_ticket: "⭐",
  booth_rental_ticket: "🏢",
};

const SalePage: NextPage = () => {
  const pathname = usePathname();
  const eventId = pathname ? pathname.split("/").at(2) : null;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOverLimit, setIsOverLimit] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}/sale`)
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setEventDetails(data.eventDetails);
          setTickets(data.tickets);
        })
        .catch((err) => console.error(err));
    }

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [eventId]);

  useEffect(() => {
    checkTicketLimit();
  }, [cart]);

  const checkTicketLimit = () => {
    if (eventDetails) {
      const totalTicketsInCart = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setIsOverLimit(totalTicketsInCart > eventDetails.remainingTickets);
    }
  };

  const handleAddToCart = (ticket) => {
    const existingTicket = cart.find((item) => item.ticket.id === ticket.id);
    let updatedCart;
    if (existingTicket) {
      updatedCart = cart.map((item) =>
        item.ticket.id === ticket.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ticket, quantity: 1 }];
    }
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (ticketId: number) => {
    const updatedCart = cart
      .map((item) =>
        item.ticket.id === ticketId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const totalAmount = cart.reduce(
    (total, item) => total + parseFloat(item.ticket.price) * item.quantity,
    0
  );

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          x: "100vw",
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          x: "-100vw",
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          ease: "easeInOut",
        }}
        className={`${inter.className} p-5 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen flex`}
      >
        <div className="w-2/3 p-5">
          <div className="bg-white shadow-xl rounded-3xl p-8 mb-10">
            <motion.h1
              className="text-4xl font-extrabold mb-4 text-gray-900 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tickets for: {eventDetails.eventName} 🎉
            </motion.h1>
            <p className="text-gray-700 mb-4">
              {eventDetails.eventDescription}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>📅 Start Date:</strong>{" "}
              {new Date(eventDetails.startDate).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>📅 End Date:</strong>{" "}
              {new Date(eventDetails.endDate).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>👥 Max Attendants:</strong> {eventDetails.maxAttendant}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>🎫 Remaining Tickets:</strong>{" "}
              {eventDetails.remainingTickets}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>🏢 Organized by:</strong> {eventDetails.companyName}
            </p>
            <p className="text-gray-700 mb-4">
              {eventDetails.companyDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                className="bg-white cursor-pointer shadow-xl rounded-3xl p-5 flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(ticket)}
              >
                <div className="text-5xl">
                  {ticketEmojis[ticket.ticketType]}
                </div>
                <h2 className="text-2xl font-bold mt-4">{ticket.name}</h2>
                <p className="text-gray-700 mt-2">
                  ${parseFloat(ticket.price).toFixed(2)}
                </p>
                <p className="text-gray-500 mt-2">
                  {ticket.ticketTypeDescription}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-white shadow-xl rounded-3xl p-8 ml-5">
          <h2 className="text-2xl font-semibold mb-4">Your Cart 🛒</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex  justify-between items-center mb-2"
                >
                  <span>{item.ticket.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2">
                      ${parseFloat(item.ticket.price).toFixed(2)} x{" "}
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.ticket.id)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                className={`mt-5 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                  isOverLimit ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleCheckout}
                disabled={isOverLimit}
              >
                Checkout 💳
              </button>
              {isOverLimit && (
                <p className="text-red-500 mt-2">
                  You have exceeded the available number of tickets.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SalePage;
