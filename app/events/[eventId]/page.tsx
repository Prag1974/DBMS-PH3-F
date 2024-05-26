/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { EventDetails } from "@/app/libs/types";

const inter = Inter({ subsets: ["latin"] });

const roleEmojis: { [key: string]: string } = {
  Administrator: "👥",
  Organizator: "🎟️",
  Speaker: "🎤",
  Host: "🕴️",
  "Security Officer": "🛡️",
  "Marketting Clerk": "📈",
  Technician: "🛠️",
  Moderator: "🗣️",
};

const EventDetailPage: NextPage = () => {
  const pathname = usePathname();
  const eventId = pathname ? pathname.split("/").pop() : null;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const router = useRouter();
  const [showContent, setShowContent] = useState<boolean>(true);

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("response is not ok");
          }
          return res.json();
        })
        .then((data: EventDetails) => {
          console.log(data);
          setEventDetails(data);
        })
        .catch((err) => console.error(err));
    }
  }, [eventId]);

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  const managerCount = eventDetails.employees.length;

  const handleBuyTicketClick = () => {
    setShowContent(false);
    setTimeout(() => {
      router.push(`/events/${eventId}/sale`);
    }, 1000);
  };

  console.log(eventDetails);
  return (
    <AnimatePresence>
      {showContent && (
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
          className={`${inter.className} p-5 bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen`}
        >
          <div className="relative bg-white shadow-xl rounded-3xl p-8 mb-10 mx-5">
            <motion.h1
              className="text-4xl font-extrabold mb-4 text-gray-900 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {eventDetails.eventName} 🎉
            </motion.h1>
            <p className="text-gray-700 mb-4">
              {eventDetails.eventDescription}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>📅 Start Date:</strong>{" "}
              {format(eventDetails.startDate, "yyyy-MM-dd HH:mm:ss")}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>📅 End Date:</strong>{" "}
              {format(eventDetails.endDate, "yyyy-MM-dd HH:mm:ss")}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>👥 Max Attendants:</strong> {eventDetails.maxAttendant}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>🎫 Remaining Tickets:</strong>{" "}
              {eventDetails.remainingTickets}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>📍 Address:</strong> {eventDetails.street},{" "}
              {eventDetails.district}, {eventDetails.city}, {eventDetails.state}
              , {eventDetails.country}
            </p>
            <p className="text-gray-700 mb-4">
              {eventDetails.addressDescription}
            </p>
            <motion.button
              className="absolute top-5 right-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              whileHover={{
                scale: 1.1,
                textShadow: "0px 0px 8px rgb(255,255,255)",
                boxShadow: "0px 0px 8px rgb(255,255,255)",
              }}
              transition={{
                duration: 0.3,
                yoyo: 2,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBuyTicketClick()}
            >
              Buy Ticket 🎟️
            </motion.button>
          </div>
          <div className="bg-white shadow-xl rounded-3xl p-8 mb-10 mx-5">
            <motion.h2
              className="text-3xl font-semibold mb-4 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Organized by {eventDetails.companyName} 🏢
            </motion.h2>
            <p className="text-gray-700 mb-4">
              {eventDetails.companyDescription}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-3xl p-8 mb-10 mx-5">
            <motion.h2
              className="text-3xl font-semibold mb-4 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Manager 👥 - {managerCount}
            </motion.h2>
            <ul>
              {eventDetails.employees && eventDetails.employees.length > 0 ? (
                eventDetails.employees.map((employee, index) => (
                  <li
                    key={index}
                    className="border-b py-2 text-gray-700 flex items-center"
                  >
                    <span className="mr-2">
                      {roleEmojis[employee.employeeRole] ?? "👤"}
                    </span>
                    {employee.employeeName} - {employee.employeeRole}
                  </li>
                ))
              ) : (
                <li>No employees found.</li>
              )}
            </ul>
          </div>
          <div className="bg-white shadow-xl rounded-3xl p-8 mx-5">
            <motion.h2
              className="text-3xl font-semibold mb-4 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Reviews 💬
            </motion.h2>
            <div>
              {eventDetails.reviews && eventDetails.reviews.length > 0 ? (
                eventDetails.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md flex items-start justify-between"
                  >
                    <div className="flex items-start">
                      <img
                        src="https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?w=300&ssl=1"
                        alt="Default Avatar"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="flex items-center mb-2">
                          <strong className="mr-2 text-gray-900">
                            {review.considererName}
                          </strong>
                          <span className="text-yellow-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(review.reviewDate, "yyyy-MM-dd HH:mm:ss")}
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailPage;
