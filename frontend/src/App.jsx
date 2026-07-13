import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
