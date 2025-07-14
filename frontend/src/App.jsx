import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import BucketList from "./components/BucketList";
import Navbar from "./components/Navbar";
import FormPost from "./components/FormPost";
import { useState } from "react";

function LayoutWithNavbar({ children, successMessage }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar successMessage={successMessage} />}
      {children}
    </>
  );
}

function App() {
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <BrowserRouter>
      <LayoutWithNavbar successMessage={successMessage}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<BucketList />} />
          <Route
            path="/new"
            element={<FormPost setSuccessMessage={setSuccessMessage} />}
          />
        </Routes>
      </LayoutWithNavbar>
    </BrowserRouter>
  );
}

export default App;
