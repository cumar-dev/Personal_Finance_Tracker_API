import Header from "@/Pages/Header";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default MainLayout;