import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Cute GIFs
const loadingGif = "https://s3.getstickerpack.com/storage/uploads/sticker-pack/quby-pentol-gif/sticker_10.gif?ebb3fcb448d4eb7a6b1a369af399b9ea";
const successGif = "https://s3.getstickerpack.com/storage/uploads/sticker-pack/quby-pentol-gif/sticker_11.gif?ebb3fcb448d4eb7a6b1a369af399b9ea&d=200x200";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      alert("❗ Please enter both name and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://openup-0vcs.onrender.com/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ " + (data.message || "Login failed"));
        return;
      }

      // ✅ Show success modal
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      console.error("Login Error:", err);
      alert("❌ Network error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-pink-700 px-4 relative">

  {/* 🌀 Loading Modal */}
{loading && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/20 border border-white/30 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center shadow-xl space-y-4">
      <img src={loadingGif} alt="Logging in..." className="w-24 h-24 animate-bounce" />
      <h2 className="text-white text-xl font-semibold tracking-wide">⏳ Rukoo... Horhaa...</h2>
    </div>
  </div>
)}

{/* ✅ Success Modal */}
{showSuccess && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/20 border border-white/30 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-center shadow-xl space-y-4">
      <img src={successGif} alt="Success" className="w-24 h-24 animate-pulse" />
      <h2 className="text-pink-200 text-xl font-semibold tracking-wide"> Hogyaa! Tallooo 🎉</h2>
    </div>
  </div>
)}


      {/* 💖 Login Form */}
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white space-y-6 z-10">
        <h2 className="text-4xl font-bold text-center tracking-wide drop-shadow">
          Welcome Back 
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 placeholder-white text-white rounded-lg focus:ring-2 focus:ring-pink-300 backdrop-blur-sm outline-none disabled:opacity-60"
        />

        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 placeholder-white text-white rounded-lg focus:ring-2 focus:ring-pink-300 backdrop-blur-sm outline-none disabled:opacity-60"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 backdrop-blur-sm ${
            loading
              ? "bg-white/30 text-black cursor-not-allowed"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
        >
          Login
        </button>

        {/* <p className="text-center text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-white underline hover:text-pink-200 font-medium"
          >
            Register
          </Link>
        </p> */}
      </div>
    </div>
  );
}
 