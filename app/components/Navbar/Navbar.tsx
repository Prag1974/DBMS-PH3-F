"use client";
import { NextPage } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface Props {}

interface User {
  name: string;
  email: string;
  role: string; // Admin veya diğer roller
}

const Navbar: NextPage<Props> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successful!", {
      autoClose: 1000,
      onClose: () => {
        window.location.href = "/";
      },
    });
  };

  return (
    <motion.nav
      className="w-full h-20 bg-white flex items-center justify-between px-8 shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
    >
      <ToastContainer />
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/" legacyBehavior>
          <a className="text-center flex justify-center items-center">
            <svg
              className="h-14 w-auto object-contain p-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#0070f3"
                d="M192 368.004c0-8.844 7.156-16 16-16s16 7.156 16 16-7.156 16-16 16-16-7.156-16-16zM349.328 494.16c-4.266 1.219-8.672 2.094-13.328 2.094-26.516 0-48-21.484-48-48v-58.188c0-20.094 12.898-37.156 30.797-43.438C353.164 335.082 384 306.082 384 272.004V240c0-15.164-6.188-29.285-16-41.367V162.5c0-17.668-14.328-23.719-32-13.496l-24.516 14.176C303.633 161.145 295.703 160 288 160h-64c-7.699 0-15.633 1.145-23.484 3.18L176 149.004c-17.668-10.223-32-4.172-32 13.496v36.133c-9.812 12.082-16 26.203-16 41.367v32.004c0 23.281 14.488 44.188 34.578 58.812l-.02.031c4.172 2.859 6.945 7.688 6.945 13.156 0 8.828-7.176 16-16 16-4.52 0-8.574-1.891-11.48-4.906C115.004 334.629 96 305.035 96 272.004V240c0-18.523 6.012-35.977 16-51.375v-47.633c0-35.336 28.645-47.438 64-26.996l27.461 15.887C210.309 128.719 217.172 128 224 128h64c6.828 0 13.688.719 20.539 1.883L336 113.996c35.359-20.441 64-8.34 64 26.996v47.633c9.984 15.398 16 32.852 16 51.375v32.004c0 47.609-39.25 88.141-85.531 104.359-.055.047-.109.172-.188.188-6.016 2.312-10.281 8.125-10.281 14.953v56.75c0 8.844 7.156 16 16 16 1.336 0 2.562-.375 3.797-.688C421.969 430.41 480 350.066 480 256c0-123.715-100.281-224-224-224C132.285 32 32 132.285 32 256c0 97.41 62.254 180.066 149.121 210.895.445.047.852.234 1.316.234 5.277 0 9.562-4.297 9.562-9.562 0-5.281-4.285-9.562-9.562-9.562-.113 0-.113-.094-.191-.141-53.16-1.422-53.219-63.859-70.246-63.859-8.844 0-16-7.156-16-16s7.156-16 16-16h7.988c32.02 0 27.445 64 72.012 64 17.668 0 32 14.328 32 32v28c0 15.453-12.527 28-28.004 28-1.688 0-3.277-.344-4.887-.656C81.203 474.613 0 374.926 0 256 0 114.617 114.617 0 256 0s256 114.617 256 256c0 108.41-67.492 200.848-162.672 238.16z"
              />
            </svg>
          </a>
        </Link>
      </motion.div>
      <div className="flex items-center gap-10">
        <Link href="/about" legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.1, color: "#0070f3" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-xl cursor-pointer"
          >
            About
          </motion.a>
        </Link>
        {user?.role === "Administrator" && (
          <>
            <Link href="/admin" legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1, color: "#0070f3" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-xl cursor-pointer"
              >
                Admin Panel
              </motion.a>
            </Link>
            <Link href="/create" legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1, color: "#0070f3" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-xl cursor-pointer"
              >
                Create Event
              </motion.a>
            </Link>
          </>
        )}
        {user && (
          <Link href="/statistics" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.1, color: "#0070f3" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-xl cursor-pointer"
            >
              Statistics
            </motion.a>
          </Link>
        )}

        {!user ? (
          <Link href="/login" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.1, color: "#0070f3" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-xl cursor-pointer"
            >
              Login
            </motion.a>
          </Link>
        ) : (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1, color: "#0070f3" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-xl cursor-pointer flex items-center space-x-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{user.name}</span>
              <svg
                className="h-6 w-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 13.879A3 3 0 0112 12h0a3 3 0 016 0 3 3 0 01-6 0h0a3 3 0 00-6.879 1.879z"
                />
              </svg>
            </motion.button>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleLogout()}
                >
                  Logout <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
