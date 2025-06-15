import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAVBAR_HEIGHT = 50; // px

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      height: NAVBAR_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }}>
      <div className="container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="logo" style={{ fontWeight: 700, fontSize: 22, color: '#4F46E5', textDecoration: 'none' }}>
          SocialConnect
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 28,
            marginLeft: 16
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            transition: 'all 0.3s',
          }}
        >
          {currentUser && <Link to="/daftar-dinner">Daftar Dinner</Link>}
          <Link to="/events">Riwayat</Link>
          {currentUser && currentUser.role === 'admin' && (
            <Link to="/admin" style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ⚙️ Admin
            </Link>
          )}
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
              <span>Hello, {currentUser.first_name}!</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .navbar-hamburger {
            display: block !important;
          }
          .nav-links {
            position: absolute;
            top: ${NAVBAR_HEIGHT}px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            padding: 12px 0;
            z-index: 999;
            display: ${menuOpen ? 'flex' : 'none'} !important;
          }
          body, #root, .App {
            padding-top: ${NAVBAR_HEIGHT + (menuOpen ? 120 : 0)}px !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 