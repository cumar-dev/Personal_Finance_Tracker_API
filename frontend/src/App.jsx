import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import DashboardLayout from "./Pages/DashboardLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}/>
      </Routes>
    </>
  );
}

export default App;
