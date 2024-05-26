"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventFromDB } from "./libs/types";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventFromDB[]>([]);
  const [pastEvents, setPastEvents] = useState<EventFromDB[]>([]);
  const [showContent, setShowContent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("cart");
    fetch("/api")
      .then((res) => res.json())
      .then((data: EventFromDB[]) => {
        const now = new Date();

        const upcoming = data
          .filter((event) => new Date(event.startDate) > now)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        const past = data
          .filter((event) => new Date(event.startDate) <= now)
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCardClick = (eventId: number) => {
    setShowContent(false);
    setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 500);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const splitText = (text: string) =>
    text.split("").map((char, index) => (
      <motion.span
        key={index}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {char}
      </motion.span>
    ));

  return (
    <div className="p-5 bg-gradient-to-r from-green-100 to-blue-100 min-h-screen">
      <AnimatePresence>
        {showContent && (
          <motion.div
            exit={{ x: "-100vw" }}
            transition={{
              ease: "easeInOut",
            }}
          >
            <motion.h2
              className="text-4xl font-semibold mb-4 text-gray-800 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🎉 {splitText("UpcomingEvents")}
            </motion.h2>

            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {upcomingEvents.map((e) => (
                <Card
                  event={e}
                  key={e.id}
                  onClick={() => handleCardClick(e.id)}
                />
              ))}
            </motion.div>

            <motion.h2
              className="text-4xl font-semibold mt-10 mb-4 text-gray-800 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🕰️ {splitText("Past Events")}
            </motion.h2>
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {pastEvents.map((e) => (
                <Card
                  event={e}
                  key={e.id}
                  onClick={() => handleCardClick(e.id)}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
