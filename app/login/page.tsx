"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showContent, setShowContent] = useState<boolean>(true);

  const handleLogin = async () => {
    if (!email || !password)
      return toast.error("Email and password are required", {
        autoClose: 1000,
      });

    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Login successful!", {
          autoClose: 1500,
        });
        setTimeout(() => {
          setShowContent(false);
          window.location.href = "/";
        }, 1500);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials." + error);
    }
  };

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
          className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500"
        >
          <ToastContainer />
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPage;
