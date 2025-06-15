import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Tangerang',
    'Depok', 'Semarang', 'Palembang', 'Makassar', 'Yogyakarta', 'Malang', 'Solo'
  ];

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = selectedCity ? { city: selectedCity } : {};
      const response = await axios.get('/api/events', { params });
      setEvents(response.data.events);
      setError('');
    } catch (err) {
      setError('Gagal memuat events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBudgetColor = (budget) => {
    // Minimalist color scheme - only using subtle grays and one accent
    switch(budget) {
      case '100k-200k': return '#6B7280';
      case '200k-300k': return '#6B7280';
      case '300k-400k': return '#6B7280';
      case '400k-500k': return '#6B7280';
      case '500k+': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ 
      marginTop: '80px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: 'calc(100vh - 80px)',
      padding: '0'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        padding: '0px 20px 40px 20px',
        textAlign: 'center',
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            fontSize: '80px', 
            marginBottom: '24px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}>🍽️</div>
          
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px', 
            color: 'white',
            fontWeight: '800',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            lineHeight: '1.2'
          }}>
            Event Makan Malam Misterius
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Temukan pengalaman baru dan teman baru di kotamu
          </p>
          
          {/* City Filter */}
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                borderRadius: '50px', 
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">🌍 Semua Kota</option>
              {cities.map(city => (
                <option key={city} value={city}>📍 {city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'white'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '18px', opacity: 0.9 }}>Memuat events...</p>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: '#EF4444',
              marginBottom: '40px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{error}</p>
            </div>
          )}

          {!loading && events.length === 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              marginBottom: '40px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
              <h3 style={{ 
                marginBottom: '16px', 
                color: '#333',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Belum Ada Event
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '32px',
                fontSize: '16px',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 32px'
              }}>
                {selectedCity 
                  ? `Belum ada event di ${selectedCity}. Coba pilih kota lain atau tunggu event baru.`
                  : 'Belum ada event tersedia saat ini. Silakan cek kembali nanti.'
                }
              </p>
              <Link 
                to="/daftar-dinner"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Daftar Dinner Sekarang
              </Link>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '32px',
              marginBottom: '60px'
            }}>
              {events.map(event => (
                <div key={event.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '400px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                >
                  {/* Event Header */}
                  <div style={{
                    background: '#F9FAFB',
                    padding: '20px',
                    borderBottom: '1px solid #E5E7EB',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: '#E5E7EB',
                      color: '#6B7280',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      Max {event.max_participants} orang
                    </div>
                    
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                      paddingRight: '80px',
                      color: '#111827'
                    }}>
                      {event.title}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#6B7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📅</span>
                        <span>{formatDate(event.event_date).split(' pukul ')[0]}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📍</span>
                        <span>{event.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Body */}
                  <div style={{ 
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1'
                  }}>
                    <div style={{ flex: '1' }}>
                      <p style={{
                        color: '#6B7280',
                        lineHeight: '1.5',
                        marginBottom: '16px',
                        fontSize: '13px',
                        minHeight: '40px'
                      }}>
                        {event.description || 'Bergabunglah dalam pengalaman makan malam misterius dan temukan teman baru yang menarik!'}
                      </p>
                      
                      {/* Budget & Fee */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #F3F4F6'
                      }}>
                        <div style={{
                          fontSize: '13px',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          💰 Budget: {event.budget_range}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          Fee: Rp {event.platform_fee?.toLocaleString('id-ID') || '0'}
                        </div>
                      </div>

                      {/* Deadline */}
                      <div style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>⏰</span>
                        <span>Deadline: {formatDeadline(event.registration_deadline)}</span>
                      </div>
                    </div>
                    
                    {/* CTA Button - Always at bottom */}
                    <Link 
                      to={`/events/${event.id}`}
                      style={{
                        display: 'block',
                        background: '#111827',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'background-color 0.2s',
                        marginTop: '20px'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
                    >
                      Lihat Detail & Daftar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How It Works Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤔</div>
            <h3 style={{ 
              marginBottom: '12px', 
              color: '#111827',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Bagaimana Cara Kerjanya?
            </h3>
            <p style={{
              color: '#6B7280',
              fontSize: '14px',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px'
            }}>
              Proses sederhana untuk bertemu teman baru dan menikmati pengalaman kuliner yang tak terlupakan
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>1️⃣</div>
                <h4 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Daftar</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.4', color: '#6B7280' }}>
                  Lengkapi profil dengan budget dinner & preferensi makanan
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>2️⃣</div>
                <h4 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Matching</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.4', color: '#6B7280' }}>
                  Tunggu sistem mencocokkan 6 orang dengan budget & minat serupa
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>3️⃣</div>
                <h4 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Bayar Fee</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.4', color: '#6B7280' }}>
                  Setelah match, bayar platform fee untuk koordinasi grup
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>4️⃣</div>
                <h4 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>Dinner!</h4>
                <p style={{ fontSize: '13px', lineHeight: '1.4', color: '#6B7280' }}>
                  Datang dan nikmati makan malam dengan teman baru!
                </p>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '32px', 
              padding: '20px', 
              backgroundColor: '#F9FAFB', 
              borderRadius: '8px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💡</div>
              <h4 style={{ marginBottom: '8px', color: '#111827', fontSize: '16px', fontWeight: '600' }}>
                Info Penting
              </h4>
              <p style={{ color: '#6B7280', lineHeight: '1.5', fontSize: '13px' }}>
                <strong>Platform Fee</strong> adalah biaya untuk matching algoritma & koordinasi grup. 
                Budget dinner dibayar langsung di restoran sesuai konsumsi masing-masing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 