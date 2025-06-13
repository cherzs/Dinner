import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Initialize edit data with current user data
    setEditData({
      occupation: currentUser.occupation || '',
      bio: currentUser.bio || '',
      interests: currentUser.interests || '',
      dietary_restrictions: currentUser.dietary_restrictions || 'Tidak Ada',
      gender: currentUser.gender || ''
    });
    
    fetchUserRegistrations();
  }, [currentUser, navigate]);

  const fetchUserRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/my-dinner-registrations');
      console.log('User registrations with groups:', response.data.registrations);
      setRegistrations(response.data.registrations || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      occupation: currentUser.occupation || '',
      bio: currentUser.bio || '',
      interests: currentUser.interests || '',
      dietary_restrictions: currentUser.dietary_restrictions || 'Tidak Ada',
      gender: currentUser.gender || ''
    });
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put('/api/profile', editData);
      
      if (response.data.success) {
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal memperbarui profil');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profile_image', profileImage);

      const response = await axios.post('/api/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Foto profil berhasil diupdate!');
        setProfileImage(null);
        setImagePreview(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload foto profil');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!currentUser) {
    return null;
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
      
      {/* Profile Header */}
      <div style={{
        padding: '60px 0',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* User Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 24px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              border: '4px solid rgba(255,255,255,0.3)',
              backgroundImage: imagePreview ? `url(${imagePreview})` : 
                              currentUser.has_profile_image ? `url(http://localhost:3000/api/profile/image/${currentUser.id})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!imagePreview && !currentUser.has_profile_image && (
                <span>{currentUser.first_name.charAt(0)}{currentUser.last_name.charAt(0)}</span>
              )}
            </div>
            
            {/* Edit Photo Button */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: '2px solid rgba(255,255,255,0.9)'
            }}
            onClick={() => document.getElementById('profile-image-input').click()}
            >
              <span style={{ fontSize: '16px' }}>📷</span>
            </div>
            
            {/* Hidden File Input */}
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          
          {/* Image Upload Controls */}
          {profileImage && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{
                color: 'white',
                fontSize: '14px',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                Foto baru dipilih. Klik "Upload" untuk menyimpan.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    color: '#333',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    opacity: uploadingImage ? 0.7 : 1
                  }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => {
                    setProfileImage(null);
                    setImagePreview(null);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
          
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {currentUser.first_name} {currentUser.last_name}
          </h1>
          
          <p style={{
            fontSize: '18px',
            opacity: '0.9',
            margin: '0',
            fontWeight: '500'
          }}>
            {currentUser.age} tahun • {currentUser.city} • {currentUser.occupation}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '32px',
          alignItems: 'start'
        }}>
          
          {/* Left Column - Main Content */}
          <div>
            
            {/* About Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#333',
                  margin: 0
                }}>
                  Tentang Saya
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={editData.occupation}
                      onChange={handleEditChange}
                      placeholder="e.g. Software Engineer, Teacher, Student"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Tentang Kamu
                    </label>
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleEditChange}
                      rows="4"
                      placeholder="Ceritakan sedikit tentang dirimu..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Minat & Hobi (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={editData.interests}
                      onChange={handleEditChange}
                      placeholder="e.g. Technology, Management, Analytics"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Preferensi Makanan
                    </label>
                    <select
                      name="dietary_restrictions"
                      value={editData.dietary_restrictions}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="Tidak Ada">Tidak Ada</option>
                      <option value="Halal">Halal</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="No Pork">No Pork</option>
                      <option value="No Seafood">No Seafood</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Jenis Kelamin
                    </label>
                    <select
                      name="gender"
                      value={editData.gender || ''}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateLoading}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: updateLoading ? 'not-allowed' : 'pointer',
                        opacity: updateLoading ? 0.7 : 1
                      }}
                    >
                      {updateLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: '#F3F4F6',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Pekerjaan:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.occupation}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Email:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.email}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Budget Range:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.budget_preference}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Preferensi Makanan:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.dietary_restrictions}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Jenis Kelamin:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.gender || 'Belum diisi'}
                      </div>
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Bahasa:
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {currentUser.preferred_language}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Administrator of SocialConnect platform
                    </div>
                  </div>

                  {currentUser.interests && currentUser.interests !== 'Belum diisi' && (
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        Minat & Hobi:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {currentUser.interests.split(',').map((interest, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-block',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            {interest.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Event History */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '24px'
              }}>
                Riwayat Event
              </h2>

              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6B7280'
                }}>
                  Memuat riwayat event...
                </div>
              ) : registrations.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px'
                }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '16px',
                    opacity: '0.5'
                  }}>
                    🍽️
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Belum Ada Event
                  </h3>
                  <p style={{
                    color: '#6B7280',
                    marginBottom: '24px',
                    fontSize: '16px'
                  }}>
                    Kamu belum mendaftar untuk event apapun. Mulai petualangan baru sekarang!
                  </p>
                  <button
                    onClick={() => navigate('/daftar-dinner')}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Daftar Dinner Sekarang
                  </button>
                </div>
              ) : (
                <div style={{ space: '24px' }}>
                  {registrations.map((registration, index) => (
                    <div key={index} style={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '16px',
                      background: '#FAFAFA'
                    }}>
                      {/* Registration Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 4px 0'
                          }}>
                            Mystery Dinner - {registration.kota}
                          </h4>
                          <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            margin: 0
                          }}>
                            {formatDate(registration.tanggal_tersedia)} • {registration.budget_preference} • {registration.waktu_preference}
                          </p>
                        </div>
                        <span style={{
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor:
                            registration.status === 'completed' ? '#D1FAE5' :
                            registration.status === 'matched' ? '#DBEAFE' :
                            registration.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                          color:
                            registration.status === 'completed' ? '#059669' :
                            registration.status === 'matched' ? '#2563EB' :
                            registration.status === 'pending' ? '#D97706' : '#DC2626'
                        }}>
                          {registration.status === 'completed' ? 'Selesai' :
                           registration.status === 'matched' ? 'Sudah Match!' :
                           registration.status === 'pending' ? 'Menunggu Match' : 'Cancelled'}
                        </span>
                      </div>

                      {/* Group Members (only show if matched) */}
                      {registration.status === 'matched' && registration.group_members && registration.group_members.length > 0 && (
                        <div style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <h5 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 12px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            👥 Teman Dinner Kamu ({registration.total_members} orang)
                          </h5>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '12px'
                          }}>
                            {registration.group_members.map((member, memberIndex) => (
                              <div key={memberIndex} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: '#F9FAFB',
                                borderRadius: '8px',
                                border: '1px solid #F3F4F6'
                              }}>
                                {/* Avatar */}
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: '#E5E7EB',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#6B7280',
                                  backgroundImage: member.has_profile_image ? `url(/api/profile/image/${member.id})` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}>
                                  {!member.has_profile_image && (
                                    <span>{member.first_name.charAt(0)}{member.last_name.charAt(0)}</span>
                                  )}
                                </div>
                                
                                {/* Member Info */}
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#111827',
                                    marginBottom: '2px'
                                  }}>
                                    {member.first_name} {member.last_name}
                                  </div>
                                  <div style={{
                                    fontSize: '12px',
                                    color: '#6B7280'
                                  }}>
                                    {member.age} tahun • {member.occupation}
                                  </div>
                                  {member.gender && (
                                    <div style={{
                                      fontSize: '12px',
                                      color: '#6B7280'
                                    }}>
                                      {member.gender}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: '#EFF6FF',
                            borderRadius: '8px',
                            border: '1px solid #DBEAFE'
                          }}>
                            <p style={{
                              fontSize: '12px',
                              color: '#1E40AF',
                              margin: 0,
                              textAlign: 'center'
                            }}>
                              💡 Koordinasi lebih lanjut akan dikirim via email atau WhatsApp
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pending Status Info */}
                      {registration.status === 'pending' && (
                        <div style={{
                          background: '#FFFBEB',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #FDE68A'
                        }}>
                          <p style={{
                            fontSize: '12px',
                            color: '#92400E',
                            margin: 0,
                            textAlign: 'center'
                          }}>
                            ⏳ Menunggu sistem mencarikan teman dinner yang cocok...
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            
            {/* Quick Stats */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '20px'
              }}>
                Statistik
              </h3>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#667eea',
                  marginBottom: '8px'
                }}>
                  {registrations.length}
                </div>
                <div style={{
                  color: '#6B7280',
                  fontSize: '14px',
                  marginBottom: '24px',
                  fontWeight: '500'
                }}>
                  Event Diikuti
                </div>
                
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#667eea',
                  marginBottom: '8px'
                }}>
                  {registrations.filter(r => r.status === 'completed').length}
                </div>
                <div style={{
                  color: '#6B7280',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Event Selesai
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '20px'
              }}>
                Aksi Cepat
              </h3>
              
              <button
                onClick={() => navigate('/daftar-dinner')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                Daftar Dinner Sekarang
              </button>
              
              <button
                onClick={handleEditProfile}
                style={{
                  width: '100%',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                Edit Profile
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Apakah kamu yakin ingin logout?')) {
                    logout();
                    navigate('/');
                  }
                }}
                style={{
                  width: '100%',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>

            {/* Member Since */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '16px'
              }}>
                Info Keanggotaan
              </h3>
              
              <div style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '4px',
                fontWeight: '500'
              }}>
                Member sejak
              </div>
              <div style={{
                fontSize: '16px',
                color: '#111827',
                fontWeight: '600'
              }}>
                {formatDate(currentUser.created_at)}
              </div>
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

export default Profile; 