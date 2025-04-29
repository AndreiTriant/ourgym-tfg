import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Header({ onMenuClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileMenuRef = useRef(null);

  //Abrir y cerrar menú
  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setShowProfileMenu(prevState => !prevState);
  };

  //CArgar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/usuario/yo', { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };
  
    fetchUserData();
  }, []);

  //Cuando se hace click fuera del menú se cierra
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="reddit-header d-flex justify-content-between align-items-center px-3 py-2">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-link text-white d-lg-none me-2"
          onClick={onMenuClick}
        >
          <i className="bi bi-list fs-3"></i>
        </button>
        <div className="logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg"
            height="30"
            alt="Logo"
          />
        </div>
      </div>

      <div className="search-bar d-none d-md-block flex-grow-1 mx-3">
        <input
          type="text"
          className="form-control rounded-pill px-3"
          placeholder="Search Reddit"
        />
      </div>

      <div className="d-flex align-items-center position-relative">
        <i className="bi bi-chat mx-2 fs-5"></i>
        <i className="bi bi-bell mx-2 fs-5"></i>
        <Button variant="outline-light" size="sm" className="mx-2">
          + Create
        </Button>

        <div 
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        >
          <div 
  onClick={handleAvatarClick}
  style={{ cursor: 'pointer' }}
  className="d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
>
  {!userData ? (
    //Imagen placeholder cuando todavía carga la imagen del usuario
    <img
      src="/imagenes/fotoUsuario_placeholder.png"
      alt="Cargando..."
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
      className="rounded-circle"
    />
  ) : (
    //La imagen del usuario ya cargada
    (userData.foto_perfil ? (
      <img
        src={userData.foto_perfil}
        alt="Perfil"
        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        className="rounded-circle"
      />
    ) : (
      //Si no tiene foto de perfil (aunque más tardé haré que siempre se registre con una predeterminada)
      <img
      src="/imagenes/fotoUsuario_placeholder.png"
      alt="Cargando..."
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
      className="rounded-circle"
      />
    ))
  )}
</div>
        </div>

        {/*Menú Desplegable */}
        {showProfileMenu && (
          <div 
            ref={profileMenuRef}
            className="position-fixed"
            style={{ 
              top: '66px',
              right: '5px',
              backgroundColor: '#1a1a1b',
              borderRadius: '8px',
              padding: '20px',
              width: '220px',
              zIndex: 2000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <ul className="list-unstyled mb-0">
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none d-block py-2 px-2">
                  View Profile
                </a>

                {/*Nombre de usuario */}
                {userData && (
                  <span>
                  {userData.nom_usu}
                  </span>
                )}
              </li>

              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none d-block py-2 px-2">
                  Achievements
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-white text-decoration-none d-block py-2 px-2">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none d-block py-2 px-2">
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
