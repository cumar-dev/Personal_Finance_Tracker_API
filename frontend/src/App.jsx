import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import DashboardLayout from "./Pages/DashboardLayout";
import ProtectedRout from "./Components/Auth/ProtectedRout";
import AdminPage from "./Pages/Admin/AdminPage";
import AdminRout from "./Components/Auth/AdminRout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRout>
              <DashboardLayout />
            </ProtectedRout>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRout>
              <AdminPage />
            </AdminRout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
