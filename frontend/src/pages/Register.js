import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone
    });

    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 50
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Floating Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 2,
        marginTop: 48
      }}>
        {/* Premium Badge */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            Daftar Akun Baru
          </h2>
          <p style={{
            color: '#6B7280',
            fontSize: '16px',
            margin: 0
          }}>
            Mulai perjalanan kuliner eksklusif Anda
          </p>
        </div>
        
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Masukkan username Anda"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Masukkan email Anda"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Masukkan password Anda"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Konfirmasi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Konfirmasi password Anda"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Nama Lengkap
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Masukkan nomor telepon Anda"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '14px',
            color: '#6B7280'
          }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Masuk di sini
            </Link>
          </div>
        </form>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Register; 