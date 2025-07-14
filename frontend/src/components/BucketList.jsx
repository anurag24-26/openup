import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function BucketList() {
  const [userTasks, setUserTasks] = useState([]);
  const [activeUserIndex, setActiveUserIndex] = useState(0); // Switch between users

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await fetch("https://openup-0vcs.onrender.com/api/bucketlist/users");
        const data = await res.json();
        setUserTasks(data.userTasks || []);
      } catch (err) {
        console.error("❌ Error fetching user tasks:", err);
      }
    };
    fetchUserTasks();
  }, []);

  const allDreams = userTasks.flatMap((u) => u.tasks);
  const totalDreams = allDreams.length;
  const completedDreams = allDreams.filter((d) => d.completed).length;
  const percentage = totalDreams
    ? ((completedDreams / totalDreams) * 100).toFixed(0)
    : 0;

  const markCompleted = async (id) => {
    try {
      await fetch(`https://openup-0vcs.onrender.com/api/bucketlist/${id}/complete`, {
        method: "PATCH",
      });
      setUserTasks((prev) =>
        prev.map((u) => ({
          ...u,
          tasks: u.tasks.map((t) =>
            t._id === id ? { ...t, completed: true } : t
          ),
        }))
      );
    } catch (err) {
      console.error("❌ Error marking completed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10 font-sans">
      {/* Shared Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center space-y-4 mb-10"
      >
        <h1 className="text-3xl mt-10 sm:text-4xl font-bold text-gray-800">
          Humare Sapne 🌙
        </h1>
        <p className="text-gray-600 text-sm sm:text-lg">
          Completed <strong>{completedDreams}</strong> of{" "}
          <strong>{totalDreams}</strong> dreams
        </p>

        {/* Animated Progress Bar */}
        <div className="relative w-full h-4 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2 }}
          />
        </div>
        <p className="text-sm text-gray-500">{percentage}% completed</p>
      </motion.div>

      {/* Switch Buttons for User View */}
      {userTasks.length > 1 && (
        <div className="flex justify-center mb-8 gap-2 sm:hidden">
          {userTasks.map((u, index) => (
            <button
              key={u.user._id}
              onClick={() => setActiveUserIndex(index)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeUserIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-white/40 text-black"
              }`}
            >
              {u.user.name}
            </button>
          ))}
        </div>
      )}

      {/* Dreams Grid */}
      <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {userTasks.length > 0 &&
          userTasks.map(({ user, tasks }, idx) =>
            // Show only selected user in mobile (show all in desktop)
            idx === activeUserIndex || window.innerWidth >= 640 ? (
              <div key={user._id} className="space-y-6">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg font-semibold border-b text-center pb-2 text-gray-700"
                >
                  {user.name}'s Dreams{" "}
                  <RocketLaunchIcon className="inline w-5 h-5 text-blue-500" />
                </motion.h3>

                <div className="space-y-6">
                  {tasks.map((dream, i) => (
                    <motion.div
                      key={dream._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative rounded-3xl border border-white/20 backdrop-blur-md bg-white/20 shadow-xl overflow-hidden transition duration-300 transform hover:scale-[1.02] ${
                        dream.completed ? "opacity-60" : ""
                      }`}
                    >
                      {/* Background Overlay */}
                      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/30 via-purple-100/10 to-pink-100/20 backdrop-blur-3xl rounded-3xl"></div>

                      {/* Image */}
                      {dream.image ? (
                        <div className="relative w-full h-44 sm:h-52 z-10">
                          <img
                            src={dream.image}
                            alt={dream.text}
                            className="w-full h-full object-cover rounded-t-3xl opacity-90"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-44 flex items-center justify-center text-sm text-gray-500 bg-white/10 z-10">
                          No image uploaded
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 p-5 space-y-3 text-black-800">
                        <h3 className="text-xl font-bold">{dream.text}</h3>
                        <p className="text-sm text-black-300">
                          {dream.description}
                        </p>
                        <div className="text-xs text-black/60">
                          Added on{" "}
                          {new Date(dream.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`text-sm font-medium ${
                              dream.completed
                                ? "text-green-300"
                                : "text-yellow-500"
                            }`}
                          >
                            {dream.completed ? "✅ Completed" : "🕓 Pending"}
                          </span>
                          <button
                            onClick={() => markCompleted(dream._id)}
                            disabled={dream.completed}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition ${
                              dream.completed
                                ? "bg-white/30 text-white cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            {dream.completed ? (
                              <CheckCircleIcon className="w-5 h-5" />
                            ) : (
                              <ClockIcon className="w-5 h-5" />
                            )}
                            {dream.completed ? "Done" : "Complete"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
}
