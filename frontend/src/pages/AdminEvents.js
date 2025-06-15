import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    event_date: '',
    registration_deadline: '',
    max_participants: 6,
    budget_range: '100k-200k',
    status: 'open'
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const navigate = useNavigate();

  const budgetOptions = ['100k-200k', '200k-300k', '300k-400k', '400k-500k', '500k+'];
  const statusOptions = ['open', 'closed', 'completed'];
  const cityOptions = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'];

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, cityFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (cityFilter) params.append('city', cityFilter);
      
      const response = await axios.get(`/api/admin/events?${params.toString()}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/events', formData);
      if (response.data.event) {
        alert('Event berhasil dibuat!');
        setShowCreateModal(false);
        resetForm();
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Gagal membuat event: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/events/${selectedEvent.id}`, formData);
      if (response.data.event) {
        alert('Event berhasil diupdate!');
        setShowEditModal(false);
        setSelectedEvent(null);
        resetForm();
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Gagal mengupdate event: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        await axios.delete(`/api/admin/events/${eventId}`);
        alert('Event berhasil dihapus!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Gagal menghapus event: ' + (error.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      city: event.city,
      event_date: event.event_date.split('T')[0] + 'T' + event.event_date.split('T')[1].substring(0, 5),
      registration_deadline: event.registration_deadline.split('T')[0] + 'T' + event.registration_deadline.split('T')[1].substring(0, 5),
      max_participants: event.max_participants,
      budget_range: event.budget_range,
      status: event.status
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      city: '',
      event_date: '',
      registration_deadline: '',
      max_participants: 6,
      budget_range: '100k-200k',
      status: 'open'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status) => {
    const colors = {
      'open': '#10B981',
      'closed': '#F59E0B',
      'completed': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const EventModal = ({ show, onClose, onSubmit, title, isEdit = false }) => {
    if (!show) return null;

    return (
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
      onClick={onClose}
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
              {title}
            </h3>
            <button
              onClick={onClose}
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

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Judul Event
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Masukkan judul event"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Deskripsi event"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Kota
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Pilih Kota</option>
                  {cityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Budget Range
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {budgetOptions.map(budget => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Tanggal Event
                </label>
                <input
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Deadline Registrasi
                </label>
                <input
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Max Participants
                </label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value)})}
                  min="2"
                  max="50"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {isEdit && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'open' ? 'Buka' : status === 'closed' ? 'Tutup' : 'Selesai'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isEdit ? 'Update Event' : 'Buat Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
            🎉 Manajemen Event
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: '0.9',
            margin: 0
          }}>
            Kelola event dinner dan acara networking
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
        
        {/* Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Semua Status</option>
              <option value="open">Buka</option>
              <option value="closed">Tutup</option>
              <option value="completed">Selesai</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Semua Kota</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Buat Event Baru
          </button>
        </div>

        {/* Events List */}
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
            Daftar Event ({events.length})
          </h2>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6B7280'
            }}>
              Memuat data event...
            </div>
          ) : events.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '16px',
                opacity: '0.5'
              }}>
                🎉
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
                fontSize: '16px'
              }}>
                Mulai buat event pertama Anda
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px'
            }}>
              {events.map((event) => (
                <div key={event.id} style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#FAFAFA',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  {/* Event Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {event.title}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        margin: '0 0 8px 0'
                      }}>
                        📍 {event.city} • {formatDate(event.event_date)}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getBudgetColor(event.budget_range) + '20',
                          color: getBudgetColor(event.budget_range)
                        }}>
                          {event.budget_range}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getStatusColor(event.status) + '20',
                          color: getStatusColor(event.status)
                        }}>
                          {event.status === 'open' ? 'Buka' : event.status === 'closed' ? 'Tutup' : 'Selesai'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Stats */}
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea' }}>
                          {event.registration_count}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Pendaftar</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>
                          {event.groups_count}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Grup</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B' }}>
                          {event.max_participants}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Max</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(event)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#374151',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #FCA5A5',
                        borderRadius: '6px',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      <EventModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreateEvent}
        title="Buat Event Baru"
      />

      {/* Edit Event Modal */}
      <EventModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvent(null);
          resetForm();
        }}
        onSubmit={handleEditEvent}
        title="Edit Event"
        isEdit={true}
      />

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

export default AdminEvents; 