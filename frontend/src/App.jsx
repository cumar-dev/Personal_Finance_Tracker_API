import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import DashboardLayout from "./Components/DashboardLayout"
import ProtectedRout from "./Components/Auth/ProtectedRout";
import AdminRout from "./Components/Auth/AdminRout";
import Header from "./Pages/Header";
import Home from "./Pages/Home";
import AdminPage from "./Admin/AdminPage";
import Profile from "./Dashboard/Profile";
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
              <DashboardLayout
               />
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
        <Route path="/header" element={<Header />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </>
  );
}

export default App;
