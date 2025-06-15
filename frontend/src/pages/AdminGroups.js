import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dinner-registrations?status=matched');
      
      // Group registrations by group_id
      const groupedData = {};
      response.data.registrations.forEach(reg => {
        if (reg.group_id) {
          if (!groupedData[reg.group_id]) {
            groupedData[reg.group_id] = {
              group_id: reg.group_id,
              kota: reg.kota,
              budget_preference: reg.budget_preference,
              tanggal_tersedia: reg.tanggal_tersedia,
              waktu_preference: reg.waktu_preference,
              members: [],
              created_at: reg.created_at
            };
          }
          groupedData[reg.group_id].members.push({
            ...reg.user,
            registration_id: reg.id,
            dietary_restrictions: reg.dietary_restrictions,
            hobi_interests: reg.hobi_interests,
            personality_type: reg.personality_type
          });
        }
      });
      
      setGroups(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewGroupDetails = async (groupId) => {
    try {
      const response = await axios.get(`/api/dinner-group/${groupId}`);
      setSelectedGroup(response.data);
    } catch (error) {
      console.error('Error fetching group details:', error);
      alert('Gagal memuat detail grup');
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

  const getBudgetColor = (budget) => {
    const colors = {
      '100k-200k': '#10B981',
      '200k-300k': '#3B82F6',
      '300k-400k': '#8B5CF6',
      '400k-500k': '#F59E0B',
      '500k+': '#EF4444'
    };
    return colors[budget] || '#6B7280';
  };

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
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            🍽️ Manajemen Grup Dinner
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: '0.9',
            margin: 0
          }}>
            Kelola dan pantau grup-grup dinner yang sudah terbentuk
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              {groups.length}
            </div>
            <div style={{
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Total Grup Aktif
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10B981',
              marginBottom: '8px'
            }}>
              {groups.reduce((total, group) => total + group.members.length, 0)}
            </div>
            <div style={{
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Total Peserta Matched
            </div>
          </div>
        </div>

        {/* Groups List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '24px'
          }}>
            Daftar Grup Dinner
          </h2>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6B7280'
            }}>
              Memuat data grup...
            </div>
          ) : groups.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '16px',
                opacity: '0.5'
              }}>
                👥
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Belum Ada Grup
              </h3>
              <p style={{
                color: '#6B7280',
                fontSize: '16px'
              }}>
                Belum ada grup dinner yang terbentuk
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px'
            }}>
              {groups.map((group) => (
                <div key={group.group_id} style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#FAFAFA',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => viewGroupDetails(group.group_id)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                >
                  {/* Group Header */}
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
                        Grup #{group.group_id} - {group.kota}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        margin: 0
                      }}>
                        {formatDate(group.tanggal_tersedia)} • {group.waktu_preference}
                      </p>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: getBudgetColor(group.budget_preference) + '20',
                      color: getBudgetColor(group.budget_preference)
                    }}>
                      {group.budget_preference}
                    </div>
                  </div>

                  {/* Members Preview */}
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      👥 {group.members.length} Anggota
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {group.members.slice(0, 3).map((member, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          background: '#F3F4F6',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#6B7280'
                          }}>
                            {member.first_name.charAt(0)}
                          </div>
                          <span style={{ color: '#374151' }}>
                            {member.first_name}
                          </span>
                        </div>
                      ))}
                      {group.members.length > 3 && (
                        <div style={{
                          padding: '4px 8px',
                          background: '#EFF6FF',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#2563EB'
                        }}>
                          +{group.members.length - 3} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setSelectedGroup(null)}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Detail Grup #{selectedGroup.group_id}
              </h3>
              <button
                onClick={() => setSelectedGroup(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Group Info */}
            <div style={{
              background: '#F9FAFB',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Kota</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedGroup.kota}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Budget</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedGroup.budget_preference}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Tanggal</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{formatDate(selectedGroup.tanggal_tersedia)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Waktu</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedGroup.waktu_preference}</div>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Anggota Grup ({selectedGroup.total_members} orang)
              </h4>
              
              <div style={{ space: '12px' }}>
                {selectedGroup.members.map((member, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #F3F4F6',
                    marginBottom: '12px'
                  }}>
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
                        {member.age} tahun • {member.occupation} • {member.gender}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        📧 {member.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default AdminGroups; 