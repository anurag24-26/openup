import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // <-- use this for navigation
  const handleLogin = async () => {
    try {
      const res = await fetch("https://openup-0vcs.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      // ✅ Save the userId (or name) locally for Navbar or future use
      localStorage.setItem("userName", data.user.name); // for Navbar display
      localStorage.setItem("user_Id", data.user._id); // for backend fetching

      alert("✅ Login Successful: " + data.userId);
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Error logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-pink-500">
          Welcome Back 💖
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-pink-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
