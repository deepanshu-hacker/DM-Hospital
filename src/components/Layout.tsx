import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HealthAssistant from "./HealthAssistant";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <TopBar />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <HealthAssistant />
    </div>
  );
}
