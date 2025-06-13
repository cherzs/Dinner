import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data.event);
    } catch (err) {
      setError('Event tidak ditemukan');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      setError('');
      
      await axios.post(`/api/events/${id}/register`);
      setSuccess('Berhasil mendaftar! Kami akan mengirimkan detail grup kamu via email setelah proses matching selesai.');
      
      fetchEventDetail();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mendaftar untuk event');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal belum ditentukan';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  const formatPrice = (platformFee) => {
    if (!platformFee || platformFee === 0) return 'GRATIS';
    try {
      return `Rp ${platformFee.toLocaleString('id-ID')}`;
    } catch (error) {
      return 'Harga belum ditentukan';
    }
  };

  const isRegistrationOpen = (event) => {
    if (!event || !event.registration_deadline) return false;
    return new Date() < new Date(event.registration_deadline);
  };

  if (loading) {
    return (
      <div style={{ 
        marginTop: '80px', 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          Memuat detail event...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ 
        marginTop: '80px', 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2 style={{ color: '#111827', marginBottom: '8px', fontSize: '20px' }}>Event Tidak Ditemukan</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>
            Event yang kamu cari tidak ada atau sudah dihapus.
          </p>
          <button 
            onClick={() => navigate('/events')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: 'calc(100vh - 80px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Floating Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '80px',
        height: '80px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '50px',
        height: '50px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.25)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.15)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Kembali ke Events
        </button>

        {/* Event Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          
          {/* Event Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '32px'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
              margin: 0
            }}>
              {event.title || 'Event Title'}
            </h1>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginTop: '20px'
            }}>
              <div>
                <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>📅 Tanggal</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {formatDate(event.event_date)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>📍 Kota</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {event.city || 'Belum ditentukan'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>👥 Max Peserta</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {event.max_participants || 6} orang
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: '0.8', marginBottom: '4px' }}>💰 Platform Fee</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {formatPrice(event.platform_fee)}
                </div>
              </div>
            </div>
          </div>

          {/* Event Content */}
          <div style={{ padding: '32px' }}>
            
            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '12px' 
              }}>
                Tentang Event
              </h3>
              <p style={{ 
                color: '#6B7280', 
                lineHeight: '1.6', 
                fontSize: '14px',
                margin: 0
              }}>
                {event.description || 'Bergabunglah dalam pengalaman makan malam yang tak terlupakan! Kami akan mencocokkan kamu dengan orang-orang menarik untuk networking dan bersenang-senang.'}
              </p>
            </div>

            {/* Budget & Deadline Info */}
            <div style={{
              background: '#F9FAFB',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Budget Range</div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#111827',
                    padding: '4px 8px',
                    background: '#E5E7EB',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    {event.budget_range || 'Belum ditentukan'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Deadline Registrasi</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {formatDate(event.registration_deadline)}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div style={{
                background: '#FEE2E2',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{
                background: '#D1FAE5',
                color: '#059669',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

            {/* Registration Button */}
            <div style={{ textAlign: 'center' }}>
              {!currentUser ? (
                <div>
                  <p style={{ marginBottom: '16px', color: '#6B7280', fontSize: '14px' }}>
                    Login untuk mendaftar event ini
                  </p>
                  <button 
                    onClick={() => navigate('/login')}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Login untuk Mendaftar
                  </button>
                </div>
              ) : !isRegistrationOpen(event) ? (
                <div>
                  <p style={{ marginBottom: '16px', color: '#6B7280', fontSize: '14px' }}>
                    Pendaftaran sudah ditutup
                  </p>
                  <button 
                    disabled
                    style={{
                      background: '#E5E7EB',
                      color: '#9CA3AF',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'not-allowed'
                    }}
                  >
                    Pendaftaran Ditutup
                  </button>
                </div>
              ) : event.status === 'closed' ? (
                <div>
                  <p style={{ marginBottom: '16px', color: '#6B7280', fontSize: '14px' }}>
                    Event sudah penuh
                  </p>
                  <button 
                    disabled
                    style={{
                      background: '#E5E7EB',
                      color: '#9CA3AF',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'not-allowed'
                    }}
                  >
                    Event Penuh
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleRegister} 
                  disabled={registering}
                  style={{
                    background: registering ? '#E5E7EB' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: registering ? '#9CA3AF' : 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: registering ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {registering ? 'Mendaftar...' : 'Daftar Sekarang'}
                </button>
              )}
            </div>
          </div>
        </div>
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

export default EventDetail; 