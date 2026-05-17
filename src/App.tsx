/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Careers from "./pages/Careers";
import Profile from "./pages/Profile";
import AdminPortal from "./pages/AdminPortal";

import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminPortal />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
