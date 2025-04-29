import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Subnav from '../components/Subnav';
import Feed from '../components/Feed';
import Trending from '../components/Trending';
import './Home.css';

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    'Inicio',
    'Explorar',
    'Notificaciones',
    'Mensajes',
    'Guardados',
    'Premium',
  ];

  //Cierra el offcanvas al hacer resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  return (
    <>
      <Header onMenuClick={() => setShowSidebar(true)} />
      <Subnav />

      <Sidebar
        items={menuItems}
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        mobile
      />

      <div className="d-none d-lg-block">
        <Sidebar items={menuItems} show mobile={false} />
      </div>

      <main className="main-content">
        <Feed />
      </main>

      <aside className="d-none d-lg-block trending">
        <Trending />
      </aside>
    </>
  );
}
