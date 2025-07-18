import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// Shuffle helper
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function BucketList() {
  const [userTasks, setUserTasks] = useState([]);
  const [fullImage, setFullImage] = useState(null);
  const [shuffledDreams, setShuffledDreams] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserAndDreams = async () => {
      try {
        const userRes = await fetch("https://openup-0vcs.onrender.com/api/auth/me", {
          credentials: "include",
        });
        const userData = await userRes.json();

        if (!userRes.ok || !userData.user) {
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);

        const res = await fetch("https://openup-0vcs.onrender.com/api/bucketlist/users");
        const data = await res.json();

        setUserTasks(data.userTasks || []);

        const allDreams = data.userTasks.flatMap((user) =>
          user.tasks.map((task) => ({
            ...task,
            username: user.user.name,
          }))
        );

        setShuffledDreams(shuffleArray(allDreams));
      } catch (err) {
        console.error("❌ Error fetching user or dreams:", err.message);
      }
    };

    fetchUserAndDreams();
  }, []);

  const total = shuffledDreams.length;
  const completed = shuffledDreams.filter((t) => t.completed).length;
  const progress = total ? ((completed / total) * 100).toFixed(0) : 0;

  const handleComplete = async (id) => {
    try {
      await fetch(`https://openup-0vcs.onrender.com/api/bucketlist/${id}/complete`, {
        method: "PATCH",
        credentials: "include",
      });

      setShuffledDreams((prev) =>
        prev.map((dream) =>
          dream._id === id ? { ...dream, completed: true } : dream
        )
      );
    } catch (err) {
      console.error("❌ Error marking complete:", err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffdde1] via-[#ee9ca7] to-[#fad0c4] px-4">
        <div className="text-center bg-white/80 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Please log in to view the dreams 💭
          </h2>
          <p className="text-gray-700 mt-2">
            Dreams are private unless you're logged in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#ffdde1] via-[#c06470] to-[#fad0c4] font-sans">
      {/* Header */}
      <h1 className="text-3xl mt-10 font-extrabold text-gray-900 mb-6">
        🎯 Humare Dreams...
      </h1>

      {/* Progress Card */}
     <motion.div
      className="mt-[10px] bg-transparent backdrop-blur-lg rounded-2xl p-6 shadow-2xl w-full max-w-xl mx-auto space-y-5 border border-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center drop-shadow-sm">
        🎯 Bucket Progress
      </h2>

      <p className="text-center text-gray-700 text-lg font-medium">
        Completed <span className="text-indigo-600 font-bold">{completed}</span> of{" "}
        <span className="text-indigo-600 font-bold">{total}</span> dreams
      </p>

      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-300">
        <motion.div
          className="h-full bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-[#8B5CF6] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </div>

      <motion.p
        className="text-center text-sm font-semibold text-gray-700 tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ✅ <span className="text-indigo-500">{progress}%</span> completed
      </motion.p>
    </motion.div>

      {/* Dream Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {shuffledDreams.map((dream, index) => (
          <motion.div
            key={dream._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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

            {/* Dream Info */}
            <div className="space-y-2 text-gray-900">
              <h3 className="text-lg font-bold">{dream.text}</h3>
              <p className="text-sm text-gray-700">{dream.description}</p>
              <div className="text-xs text-gray-600">
                By <strong>{dream.username}</strong> on{" "}
                {new Date(dream.createdAt).toLocaleDateString("en-IN")}
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
                  onClick={() => handleComplete(dream._id)}
                  disabled={dream.completed}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    dream.completed
                      ? "bg-black/40 text-green-200 cursor-not-allowed"
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

      {/* Full Image Modal */}
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
