import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1180px] mx-auto px-6 pt-24">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
