import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function BucketList() {
  const [userTasks, setUserTasks] = useState([]);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [fullImage, setFullImage] = useState(null);

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
  const percentage = totalDreams ? ((completedDreams / totalDreams) * 100).toFixed(0) : 0;

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
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#ffdde1] via-[#ee9ca7] to-[#fad0c4] font-sans">
      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center space-y-4 mb-10"
      >
        <h1 className="text-3xl mt-10 sm:text-2xl font-extrabold text-gray-900">
          🎯 Humare Dreams...
        </h1>
        <p className="text-gray-800 text-lg sm:text-xl">
          Completed <strong>{completedDreams}</strong> of{" "}
          <strong>{totalDreams}</strong> dreams
        </p>
        <div className="relative w-full h-5 rounded-full bg-white/40 overflow-hidden shadow-inner">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2 }}
          />
        </div>
        <motion.p
          className="text-sm text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {percentage}% completed
        </motion.p>
      </motion.div>

      {/* User Switch */}
      {userTasks.length > 1 && (
        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {userTasks.map((u, index) => (
            <motion.button
              key={u.user._id}
              onClick={() => setActiveUserIndex(index)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-300 border border-white shadow ${
                activeUserIndex === index
                  ? "bg-white text-gray-800"
                  : "bg-white/20 text-white/90"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {u.user.name}
            </motion.button>
          ))}
        </div>
      )}

      {/* Dreams List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {userTasks.map(({ user, tasks }, idx) =>
          idx === activeUserIndex || window.innerWidth >= 640 ? (
            <div key={user._id} className="space-y-6">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xl text-center font-semibold text-white drop-shadow mb-2"
              >
                🚀 {user.name}'s Dreams
              </motion.h3>

              {tasks.map((dream, i) => (
                <motion.div
                  key={dream._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-3xl p-4 bg-white/30 backdrop-blur-md shadow-xl border border-white/30 overflow-hidden transition hover:scale-[1.01] ${
                    dream.completed ? "opacity-60" : ""
                  }`}
                >
                  {/* Image */}
                  {dream.image ? (
                    <>
                      <img
                        src={dream.image}
                        alt={dream.text}
                        className="w-full h-40 object-cover rounded-2xl mb-3 cursor-pointer"
                        onClick={() => setFullImage(dream.image)}
                      />
                      <p
                        className="text-xs text-blue-600 underline cursor-pointer mb-2"
                        onClick={() => setFullImage(dream.image)}
                      >
                        Click to view full image
                      </p>
                    </>
                  ) : (
                    <div className="h-40 rounded-2xl bg-white/20 flex items-center justify-center text-sm text-gray-800 mb-3">
                      No image uploaded
                    </div>
                  )}

                  {/* Text */}
                  <div className="space-y-2 text-gray-900">
                    <h3 className="text-lg font-bold">{dream.text}</h3>
                    <p className="text-sm text-gray-700">{dream.description}</p>
                    <div className="text-xs text-gray-600">
                      Added on {new Date(dream.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-700">
                      Created by: <strong>{dream.username}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-3">
                      <span
                        className={`text-sm font-medium ${
                          dream.completed ? "text-green-500" : "text-yellow-600"
                        }`}
                      >
                        {dream.completed ? "✅ Completed" : "🕓 Pending"}
                      </span>
                      <button
                        onClick={() => markCompleted(dream._id)}
                        disabled={dream.completed}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                          dream.completed
                            ? "bg-black/40 text-green cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:brightness-110"
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
          ) : null
        )}
      </div>

      {/* Full Image Preview */}
      {fullImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setFullImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white bg-black/60 p-2 rounded-full"
            onClick={() => setFullImage(null)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <img src={fullImage} alt="Full Preview" className="max-w-full max-h-[90vh] rounded-xl" />
        </div>
      )}
    </div>
  );
}
