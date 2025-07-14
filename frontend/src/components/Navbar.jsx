import {
  HomeIcon,
  PlusCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ successMessage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUsername(storedName || "");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
      label: "Home",
    },
    {
      path: "/new",
      icon: <PlusCircleIcon className="h-5 w-5" />,
      label: "Add",
    },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
      <motion.div
        key={successMessage ? "success" : location.pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`flex items-center justify-center px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 ${
          successMessage
            ? "bg-green-600/90"
            : "bg-gradient-to-r from-black/90 via-gray-700/50 to-black/90"
        }`}
      >
        <AnimatePresence mode="wait">
          {successMessage ? (
            <motion.div
              key="success-bar"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="origin-center w-full text-center text-white font-semibold text-sm sm:text-base tracking-wide"
            >
              🌟 {successMessage}
            </motion.div>
          ) : (
            <motion.div
              key="nav-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-between"
            >
              {/* Navigation Tabs */}
              <div className="flex gap-3 sm:gap-6 items-center">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center ${
                        isActive ? "gap-2" : "gap-0"
                      } px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-white/10 text-white font-semibold shadow-sm"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon}
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Username + Logout */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white capitalize">
                  {username}
                </span>
                <button onClick={handleLogout} title="Logout">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white/70 hover:text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
