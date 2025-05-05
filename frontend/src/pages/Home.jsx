import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Subnav from "../components/Subnav";
import Feed from "../components/Feed";
import Trending from "../components/Trending";
import "./Home.css";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    "Inicio",
    "Explorar",
    "Notificaciones",
    "Mensajes",
    "Guardados",
    "Premium",
  ];

  //Cierra el offcanvas al hacer resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  return (
    <div className="app-container">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header onMenuClick={() => setShowSidebar(true)} />
        <Subnav />
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <Sidebar
        items={menuItems}
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        mobile
      />

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Sidebar - Desktop */}
        <div className="sidebar-area d-none d-lg-block">
          <Sidebar items={menuItems} show mobile={false} />
        </div>

        {/* Main Feed Area */}
        <main className="feed-area">
          <Feed />
        </main>

        {/* Right Sidebar - Desktop */}
        <div className="trending-area d-none d-lg-block">
          <Trending />
        </div>
      </div>
    </div>
  );
}
