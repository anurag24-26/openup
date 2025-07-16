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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://openup-0vcs.onrender.com/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setUsername(data.user.name);
          setShowWelcome(true);

          setTimeout(() => {
            setShowWelcome(false);
          }, 3000);
        } else {
          setUsername("");
        }
      } catch (err) {
        console.error("User fetch error:", err);
        setUsername("");
      }
    };

    fetchUser();
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("https://openup-0vcs.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUsername("");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { path: "/dashboard", icon: <HomeIcon className="h-5 w-5" />, label: "Home" },
    { path: "/new", icon: <PlusCircleIcon className="h-5 w-5" />, label: "Add" },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
      <motion.div
        key={successMessage || showWelcome ? "success-or-welcome" : location.pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`h-14 sm:h-16 min-h-[56px] flex items-center justify-center px-6 py-3 rounded-full overflow-hidden backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 ${
          successMessage || showWelcome
            ? "bg-gradient-to-r from-pink-900 via-purple-700/50 to-red-900"
            : "bg-gradient-to-r from-pink-100 to-red-400"
        }`}
      >
        <AnimatePresence mode="wait">
          {successMessage ? (
            <motion.div
              key="success-bar"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="origin-center w-full text-center text-black font-semibold text-sm sm:text-base tracking-wide"
            >
              🌟 {successMessage}
            </motion.div>
          ) : showWelcome ? (
            <motion.div
              key="welcome-user"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full text-center text-black font-semibold text-sm sm:text-base"
            >
              👋 Welcome back, <span className="capitalize">{username}</span>!
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
                          ? "bg-white/10 text-black font-semibold shadow-sm"
                          : "text-black/70 hover:text-black hover:bg-white/5"
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
                <span className="text-sm font-semibold text-black capitalize">
                  {username || "Guest"}
                </span>
                {username && (
                  <button onClick={handleLogout} title="Logout">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white/70 hover:text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
