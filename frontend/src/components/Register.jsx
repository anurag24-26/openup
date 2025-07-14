import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name.trim() || !password.trim()) {
      return alert("❗ Please fill out all fields.");
    }

    setLoading(true);

    try {
      const res = await fetch("https://openup-0vcs.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return alert("❌ " + (data.message || "Registration failed"));
      }

      alert("✅ Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert("❌ Network error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Create Account 💫
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-60"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-60"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
