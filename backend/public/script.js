const loginDiv = document.getElementById("loginDiv");
const bucketSection = document.getElementById("bucketSection");
const nameInput = document.getElementById("nameInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");
const itemText = document.getElementById("itemText");
const itemDesc = document.getElementById("itemDesc");
const itemImage = document.getElementById("itemImage");
const addBtn = document.getElementById("addBtn");
const bucketList = document.getElementById("bucketList");

let currentUserId = null;

// Login
loginBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const password = passInput.value.trim();

  if (!name || !password) return alert("Enter name and password.");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Login failed.");

    currentUserId = data.userId;
    loginDiv.classList.add("hidden");
    bucketSection.classList.remove("hidden");

    loadBucketItems();
  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
};

// Logout
logoutBtn.onclick = () => {
  currentUserId = null;
  loginDiv.classList.remove("hidden");
  bucketSection.classList.add("hidden");
  bucketList.innerHTML = "";
  nameInput.value = "";
  passInput.value = "";
};

// Add bucket item
addBtn.onclick = async () => {
  const text = itemText.value.trim();
  const description = itemDesc.value.trim();
  const imageFile = itemImage.files[0];

  if (!text || !currentUserId) return alert("Missing item or user.");

  const formData = new FormData();
  formData.append("text", text);
  formData.append("description", description);
  formData.append("userId", currentUserId);
  if (imageFile) formData.append("image", imageFile);

  try {
    const res = await fetch("/api/bucketlist", {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const error = await res.json();
        alert(error.message || "Failed to add.");
      } else {
        const text = await res.text();
        alert("Unexpected response:\n" + text);
      }
      return;
    }

    const newItem = await res.json();

    itemText.value = "";
    itemDesc.value = "";
    itemImage.value = "";

    loadBucketItems();
  } catch (err) {
    alert("Upload failed.");
    console.error(err);
  }
};

// Load bucket items
async function loadBucketItems() {
  try {
    const res = await fetch(`/api/bucketlist/${currentUserId}`);
    const items = await res.json();

    bucketList.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "bg-white p-4 rounded shadow";

      const t = document.createElement("p");
      t.className = "font-semibold";
      t.textContent = item.text;
      li.appendChild(t);

      if (item.description) {
        const d = document.createElement("p");
        d.className = "text-sm text-gray-600";
        d.textContent = item.description;
        li.appendChild(d);
      }

      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.className = "mt-2 max-h-48 rounded";
        li.appendChild(img);
      }

      bucketList.appendChild(li);
    });
  } catch (err) {
    alert("Failed to load items.");
    console.error(err);
  }
}
