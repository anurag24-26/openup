import { useState, useEffect } from "react";

export default function FormPost({ setSuccessMessage }) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState(""); // ✅ store user name

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://openup-0vcs.onrender.com/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsername(data.user.name); // ✅ set username
          console.log("✅ User fetched:", data.user);
        } else {
          alert("❌ Please login to post your dream.");
        }
      } catch (err) {
        console.error("❌ Error fetching user info:", err.message);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("❌ Please login first to add your dream.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("description", description);
    formData.append("username", username); // ✅ add this
    if (image) formData.append("image", image);

    setIsSubmitting(true);
    try {
      const res = await fetch("https://openup-0vcs.onrender.com/api/bucketlist/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setText("");
      setDescription("");
      setImage(null);
      setSuccessMessage("✅ New Dream Added!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("❌ Failed to post dream: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 border border-black rounded-xl shadow-lg space-y-6 bg-white"
      >
        <h2 className="text-2xl font-bold text-center">Add a Dream ✍️</h2>

        <input
          type="text"
          placeholder="Dream Title"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-400 rounded-lg"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-sm border border-gray-400 p-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:opacity-90"
          }`}
        >
          {isSubmitting ? "Posting..." : "Post Dream"}
        </button>
      </form>
    </div>
  );
}
