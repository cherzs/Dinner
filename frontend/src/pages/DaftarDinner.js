import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DaftarDinner = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    kota: '',
    budget_preference: '',
    tanggal_tersedia: '',
    waktu_preference: 'malam',
    dietary_restrictions: 'Tidak Ada',
    hobi_interests: '',
    personality_type: '',
    age_preference: 'semua',
    gender_preference: 'semua',
    pekerjaan: '',
    tujuan_kenalan: 'teman',
    bahasa_conversation: 'Indonesian',
    special_notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const kota_options = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Tangerang',
    'Depok', 'Semarang', 'Palembang', 'Makassar', 'Yogyakarta', 'Malang'
  ];

  const budget_options = [
    { value: '100k-200k', label: '100k-200k (Fee: Rp 15.000)' },
    { value: '200k-300k', label: '200k-300k (Fee: Rp 25.000)' },
    { value: '300k-400k', label: '300k-400k (Fee: Rp 35.000)' },
    { value: '400k-500k', label: '400k-500k (Fee: Rp 45.000)' },
    { value: '500k+', label: '500k+ (Fee: Rp 55.000)' }
  ];

  const dietary_options = [
    'Tidak Ada', 'Halal', 'Vegetarian', 'Vegan', 'No Pork', 'No Seafood', 'Gluten Free'
  ];

  const personality_options = [
    'Ekstrovert - Suka berbicara dan energik',
    'Introvert - Lebih pendiam tapi pendengar yang baik',
    'Ambivert - Bisa extrovert atau introvert tergantung situasi',
    'Kreatif - Suka seni, design, atau hal-hal inovatif',
    'Analitis - Suka diskusi mendalam dan logical thinking',
    'Adventurous - Suka traveling dan mencoba hal baru',
    'Intellectual - Suka membaca, diskusi filosofis, atau akademis'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/daftar-dinner', {
        ...formData,
        user_id: currentUser.id
      });

      setSuccess('🎉 Pendaftaran berhasil! Kami akan mencarikan 5 teman dinner yang cocok untukmu. Notifikasi akan dikirim via email dalam 1-2 hari.');
      
      // Reset form
      setFormData({
        kota: '',
        budget_preference: '',
        tanggal_tersedia: '',
        waktu_preference: 'malam',
        dietary_restrictions: 'Tidak Ada',
        hobi_interests: '',
        personality_type: '',
        age_preference: 'semua',
        gender_preference: 'semua',
        pekerjaan: '',
        tujuan_kenalan: 'teman',
        bahasa_conversation: 'Indonesian',
        special_notes: ''
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mendaftar dinner');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
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

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
          <h2 style={{ 
            marginBottom: '16px', 
            color: '#1a1a1a', 
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Login Diperlukan
          </h2>
          <p style={{ 
            color: '#6B7280', 
            marginBottom: '32px', 
            fontSize: '16px', 
            lineHeight: '1.6' 
          }}>
            Kamu harus login terlebih dahulu untuk mendaftar mystery dinner dan bertemu teman-teman baru!
          </p>
          <button 
            onClick={() => navigate('/login')} 
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
            }}
          >
            Login Sekarang
          </button>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      marginTop: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: 'calc(100vh - 80px)',
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

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px',
            padding: '8px 24px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.5px'
          }}>
            ✨ Premium Dining Experience
          </div>
          
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '16px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>🍽️</div>
          
          <h1 style={{ 
            fontSize: 'clamp(32px, 6vw, 42px)', 
            marginBottom: '16px', 
            color: 'white',
            fontWeight: '700',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            lineHeight: '1.2'
          }}>
            Daftar Mystery Dinner
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.9)', 
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: '300'
          }}>
            Isi semua preferensi dengan lengkap agar kami bisa mencarikan 5 teman dinner yang paling cocok untukmu!
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                color: 'white',
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontWeight: '500'
              }}>
                ❌ {error}
              </div>
            )}
            
            {success && (
              <div style={{
                background: 'linear-gradient(135deg, #51cf66, #40c057)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontWeight: '500',
                lineHeight: '1.5'
              }}>
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              
              {/* Basic Info */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #f1f3f4'
                }}>
                  <div style={{ fontSize: '24px', marginRight: '12px' }}>📍</div>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: '700' }}>
                    Info Dasar
                  </h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Kota</label>
                    <select
                      name="kota"
                      value={formData.kota}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="">Pilih Kota</option>
                      {kota_options.map(kota => (
                        <option key={kota} value={kota}>{kota}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Tanggal Tersedia (Minggu ini)</label>
                    <input
                      type="date"
                      name="tanggal_tersedia"
                      value={formData.tanggal_tersedia}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Budget Per Orang</label>
                    <select
                      name="budget_preference"
                      value={formData.budget_preference}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="">Pilih Budget</option>
                      {budget_options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Waktu Dinner</label>
                    <select
                      name="waktu_preference"
                      value={formData.waktu_preference}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="sore">Sore (17:00-19:00)</option>
                      <option value="malam">Malam (19:00-21:00)</option>
                      <option value="malam_larut">Malam Larut (21:00-23:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Food Preferences */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #f1f3f4'
                }}>
                  <div style={{ fontSize: '24px', marginRight: '12px' }}>🍕</div>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: '700' }}>
                    Preferensi Makanan
                  </h3>
                </div>
                
                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Dietary Restrictions / Alergi</label>
                  <select
                    name="dietary_restrictions"
                    value={formData.dietary_restrictions}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  >
                    {dietary_options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Interests */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #f1f3f4'
                }}>
                  <div style={{ fontSize: '24px', marginRight: '12px' }}>🎯</div>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: '700' }}>
                    Kepribadian & Minat
                  </h3>
                </div>
                
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Hobi & Minat (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    name="hobi_interests"
                    value={formData.hobi_interests}
                    onChange={handleChange}
                    placeholder="Traveling, Photography, Kuliner, Musik, Olahraga..."
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Tipe Kepribadian</label>
                  <select
                    name="personality_type"
                    value={formData.personality_type}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  >
                    <option value="">Pilih yang paling menggambarkan dirimu</option>
                    {personality_options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Pekerjaan / Profesi</label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer, Teacher, Student, Entrepreneur..."
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>

              {/* Matching Preferences */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #f1f3f4'
                }}>
                  <div style={{ fontSize: '24px', marginRight: '12px' }}>🤝</div>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: '700' }}>
                    Preferensi Matching
                  </h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Preferensi Usia Teman</label>
                    <select
                      name="age_preference"
                      value={formData.age_preference}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="semua">Semua usia (18-60)</option>
                      <option value="muda">Usia muda (18-30)</option>
                      <option value="tengah">Usia menengah (25-40)</option>
                      <option value="mature">Lebih mature (30+)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '14px'
                    }}>Tujuan Kenalan</label>
                    <select
                      name="tujuan_kenalan"
                      value={formData.tujuan_kenalan}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="teman">Cari teman baru</option>
                      <option value="networking">Professional networking</option>
                      <option value="dating">Open for dating</option>
                      <option value="hobby">Partner hobi/aktivitas</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Bahasa Percakapan</label>
                  <select
                    name="bahasa_conversation"
                    value={formData.bahasa_conversation}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  >
                    <option value="Indonesian">Bahasa Indonesia</option>
                    <option value="English">English</option>
                    <option value="Both">Keduanya (mix)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '14px'
                  }}>Catatan Khusus (Opsional)</label>
                  <textarea
                    name="special_notes"
                    value={formData.special_notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Ada yang ingin kamu sampaikan untuk matching yang lebih baik? Misalnya: introvert, suka diskusi serius, atau hal lainnya..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f8f9fa',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div style={{ 
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                border: '2px solid #e1bee7',
                padding: '24px', 
                borderRadius: '16px', 
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }}></div>
                <h4 style={{ 
                  color: '#4a148c', 
                  margin: '0 0 16px 0', 
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>ℹ️</span>
                  Proses Selanjutnya
                </h4>
                <ul style={{ 
                  color: '#6a1b9a', 
                  margin: 0, 
                  paddingLeft: '20px',
                  lineHeight: '1.8'
                }}>
                  <li>Sistem akan mencarikan 5 orang dengan preferensi serupa</li>
                  <li>Proses matching membutuhkan 1-2 hari</li>
                  <li>Detail restoran & waktu akan dikirim via email</li>
                  <li>Platform fee dibayar setelah matching berhasil</li>
                </ul>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.4)',
                  transform: loading ? 'none' : 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                                 {loading ? (
                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ 
                       width: '20px', 
                       height: '20px', 
                       border: '2px solid #fff', 
                       borderTop: '2px solid transparent',
                       borderRadius: '50%',
                       marginRight: '12px',
                       display: 'inline-block',
                       animation: 'spin 1s linear infinite'
                     }}></span>
                     Mencari teman dinner...
                   </span>
                 ) : (
                   '🍽️ Daftar Mystery Dinner'
                 )}
              </button>
            </form>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };

export default DaftarDinner; 