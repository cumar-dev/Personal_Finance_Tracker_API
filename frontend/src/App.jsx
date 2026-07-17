import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import ProtectedRout from "./Components/Auth/ProtectedRout";
import AdminRout from "./Components/Auth/AdminRout";
import Home from "./Pages/Home";
import AdminPage from "./Admin/AdminPage";
import Profile from "./Dashboard/Profile";
import MainLayout from "./Layout/MainLayout";
import DashboardPage from "./Dashboard/DashboardPage";
import DashboardLayout from "./Components/DashboardLayout";
import GuestRoute from "./Components/Auth/GuestRoute";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRout>
              <DashboardLayout />
            </ProtectedRout>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

    

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
