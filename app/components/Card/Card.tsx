"use client";
import { EventFromDB } from "@/app/libs/types";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface Props {
  event: EventFromDB;
  onClick: () => void;
}

const Card: NextPage<Props> = ({ event, onClick }) => {
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const diffInMilliseconds = startDate.getTime() - now.getTime();

  const yearsDifference = Math.floor(
    diffInMilliseconds / (1000 * 60 * 60 * 24 * 365)
  );
  const monthsDifference = Math.floor(
    diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)
  );
  const weeksDifference = Math.floor(
    diffInMilliseconds / (1000 * 60 * 60 * 24 * 7)
  );
  const daysDifference = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const minutesDifference = Math.floor(diffInMilliseconds / (1000 * 60));

  const isUpcoming = startDate > now;

  let timeText = "";
  if (isUpcoming) {
    if (yearsDifference > 0) {
      timeText = `${yearsDifference} years left`;
    } else if (monthsDifference > 0) {
      timeText = `${monthsDifference} months left`;
    } else if (weeksDifference > 0) {
      timeText = `${weeksDifference} weeks left`;
    } else if (daysDifference > 0) {
      timeText = `${daysDifference} days left`;
    } else if (hoursDifference > 0) {
      const remainingMinutes = minutesDifference % 60;
      timeText = `${hoursDifference} hours ${remainingMinutes} minutes left`;
    } else {
      timeText = `${minutesDifference} minutes left`;
    }
  } else {
    if (yearsDifference < 0) {
      timeText = `${-yearsDifference} years ago`;
    } else if (monthsDifference < 0) {
      timeText = `${-monthsDifference} months ago`;
    } else if (weeksDifference < 0) {
      timeText = `${-weeksDifference} weeks ago`;
    } else if (daysDifference < 0) {
      timeText = `${-daysDifference} days ago`;
    } else if (hoursDifference < 0) {
      const remainingMinutes = minutesDifference % 60;
      timeText = `${-hoursDifference} hours ${remainingMinutes} minutes ago`;
    } else {
      timeText = `${-minutesDifference} minutes ago`;
    }
  }

  const renderStars = (averageConsider) => {
    if (averageConsider === null) return "N/A";

    const fullStars = Math.floor(averageConsider);

    const emptyStars = 5 - fullStars;

    return (
      <div className=" flex items-center">
        <span className="mr-2 text-sm text-gray-700">
          ({event.consider_count})
        </span>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      key={event.id}
      variants={{
        non: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { delay: event.id / 3 } },
      }}
      initial="non"
      animate="visible"
      whileHover={{
        scale: 1.15,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        transition: { delay: 0, duration: 0 },
      }}
      className="cursor-pointer relative max-w-sm rounded-2xl overflow-hidden shadow-lg p-6 bg-white border border-gray-300 transform transition-transform flex flex-col"
      onClick={onClick}
    >
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm ${
          isUpcoming ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {timeText}
      </div>
      <div className="font-bold text-2xl mb-2">{event.name}</div>
      {event.description && (
        <p className="text-gray-700 text-base mb-4 flex-grow">
          {event.description}
        </p>
      )}
      <div className="text-gray-600 text-sm mb-4">
        <p className="mb-1">
          <strong>Start Date:</strong>{" "}
          {new Date(event.startDate).toLocaleDateString()}
        </p>
        <p className="mb-1">
          <strong>End Date:</strong>{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Remaining Tickets:</strong>{" "}
          <span
            className={`${
              event.remainingTickets < 10
                ? "text-red-500 animate-blink"
                : "text-black"
            }`}
          >
            {event.remainingTickets}
          </span>
        </p>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-700">
        <strong>Rating:</strong> {renderStars(event.average_consider)}
      </div>
    </motion.div>
  );
};

export default Card;
