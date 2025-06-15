import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      paddingTop: 50
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Premium Badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px',
            padding: '8px 24px',
            marginBottom: '32px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.5px'
          }}>
            ✨ Premium Dining Experience
          </div>
          
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: '800',
            marginBottom: '24px',
            color: 'white',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            Temukan Teman Baru,<br />
            <span style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Cerita Baru
            </span>
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Bergabunglah dengan pengalaman makan malam eksklusif dan bertemu 
            dengan orang-orang inspiratif di kotamu
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px'
          }}>
            {!currentUser ? (
              <>
                <Link 
                  to="/register" 
                  style={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#1a1a1a',
                    textDecoration: 'none',
                    padding: '16px 32px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.5px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.3)';
                  }}
                >
                  Mulai Sekarang
                </Link>
                <Link 
                  to="/events" 
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '16px 32px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Lihat Events
                </Link>
              </>
            ) : (
              <Link 
                to="/daftar-dinner" 
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.3)';
                }}
              >
                Daftar Dinner Sekarang
              </Link>
            )}
          </div>
          
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px 16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFD700', marginBottom: '8px' }}>1000+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Happy Members</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px 16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFD700', marginBottom: '8px' }}>500+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Successful Dinners</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px 16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFD700', marginBottom: '8px' }}>13</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '120px 0', 
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              How It Works
            </div>
            <h2 style={{ 
              fontSize: 'clamp(36px, 6vw, 48px)', 
              marginBottom: '24px', 
              color: '#1a1a1a',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              Bagaimana Cara Kerjanya?
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#666', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Proses yang sederhana untuk pengalaman yang tak terlupakan
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '40px' 
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)'
              }} />
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>📝</div>
              <h3 style={{ 
                marginBottom: '16px', 
                color: '#1a1a1a',
                fontSize: '24px',
                fontWeight: '600'
              }}>1. Isi Preferensi</h3>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Lengkapi semua preferensi: budget, makanan, hobi, usia, dan kepribadian untuk matching terbaik.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)'
              }} />
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>🤝</div>
              <h3 style={{ 
                marginBottom: '16px', 
                color: '#1a1a1a',
                fontSize: '24px',
                fontWeight: '600'
              }}>2. Sistem Matching</h3>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Algoritma pintar mencocokkan 6 orang dengan budget, minat, dan preferensi yang serupa.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)'
              }} />
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>🍽️</div>
              <h3 style={{ 
                marginBottom: '16px', 
                color: '#1a1a1a',
                fontSize: '24px',
                fontWeight: '600'
              }}>3. Mystery Dinner</h3>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Bertemu di restoran yang dipilih khusus dan nikmati malam yang tak terlupakan!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '120px 0', 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0-20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }} />
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Ready to Start?
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(36px, 6vw, 48px)', 
            marginBottom: '24px',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Siap untuk Petualangan Baru?
          </h2>
          
          <p style={{ 
            fontSize: '20px', 
            marginBottom: '48px', 
            opacity: '0.9',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Bergabunglah dengan ribuan orang yang sudah menemukan teman baru melalui platform kami
          </p>
          
          {!currentUser ? (
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link 
                to="/register" 
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  padding: '18px 36px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.3)';
                }}
              >
                Daftar Gratis
              </Link>
              <Link 
                to="/events" 
                style={{
                  background: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '18px 36px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '500',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Lihat Events
              </Link>
            </div>
          ) : (
            <Link 
              to="/daftar-dinner" 
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: '#1a1a1a',
                textDecoration: 'none',
                padding: '18px 36px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.3)';
              }}
            >
              Daftar Dinner Sekarang
            </Link>
          )}
        </div>
      </section>

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 