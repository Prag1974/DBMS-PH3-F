/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { paymentSchema } from "../libs/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

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

const CheckoutPage: NextPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);
  const [comment, setComment] = useState("");

  const router = useRouter();

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const totalAmount = cart.reduce(
    (total, item) => total + item.ticket.price * item.quantity,
    0
  );

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleHoverRating = (rate: number) => {
    setHoverRating(rate);
  };

  const handlePayment = async () => {
    const orderDetails = {
      name: `${firstName} ${lastName}`,
      gender,
      age: Number(age),
      phoneNumber,
      cart,
      totalAmount,
      paymentInfo: {
        creditCardNumber,
        expirationDate,
        cvc,
      },
      rating,
      comment,
    };

    console.log(orderDetails);
    try {
      const validatedData = paymentSchema.parse(orderDetails);
      console.log("Valideted data:", validatedData);

      axios
        .post("http://localhost:3000/api/checkout", validatedData)
        .then((res) => console.log(res))
        .catch((err) => {
          throw err;
        });

      alert("Payment successful");

      localStorage.removeItem("cart");
      router.push("/");
    } catch (e: any) {
      e.errors.forEach((err: any) => {
        toast.error(err.message);
      });
    }
  };

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
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
        className={`${inter.className} p-5 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen flex flex-col items-center`}
      >
        <ToastContainer />
        <div className="w-2/3 bg-white shadow-xl rounded-3xl p-8 mb-10">
          <motion.h1
            className="text-4xl font-extrabold mb-4 text-gray-900 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Checkout 🛒
          </motion.h1>
          <div className="w-full mb-8">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.ticket.name}</span>
                <span>
                  ${item.ticket.price.toFixed(2)} x {item.quantity}
                </span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <form className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Kaan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Özarslan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Age
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="5464863415"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Credit Card Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="2698 9619 1140 5796"
                value={creditCardNumber}
                onChange={(e) => setCreditCardNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expiration Date
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CVC
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Comment
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-10 h-10 cursor-pointer ${
                      (hoverRating || rating)! >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => handleHoverRating(star)}
                    onMouseLeave={() => setHoverRating(undefined)}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.36-2.45a1 1 0 00-1.176 0l-3.36 2.45c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.17 9.384c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="mt-5 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 sm:col-span-2"
              onClick={() => handlePayment()}
            >
              Pay Now 💳
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutPage;
