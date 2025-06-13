import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            SocialConnect
          </Link>
          
          <div className="nav-links">
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
      </div>
    </nav>
  );
};

export default Navbar; 