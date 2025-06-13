import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [dinnerRegistrations, setDinnerRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [currentUser, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        params: { page, search: searchTerm, per_page: 20 }
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const loadDinnerRegistrations = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dinner-registrations', {
        params: { page, status: statusFilter, city: cityFilter, per_page: 20 }
      });
      setDinnerRegistrations(response.data.registrations);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading dinner registrations:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, cityFilter]);

  const toggleUserRole = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/toggle-admin`);
      loadUsers();
    } catch (error) {
      console.error('Error toggling user role:', error);
    }
  };

  const toggleUserActive = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/toggle-active`);
      loadUsers();
    } catch (error) {
      console.error('Error toggling user active status:', error);
    }
  };

  const updateDinnerStatus = async (regId, newStatus) => {
    try {
      await axios.post(`/api/admin/dinner-registrations/${regId}/update-status`, {
        status: newStatus
      });
      loadDinnerRegistrations();
    } catch (error) {
      console.error('Error updating dinner status:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'dinners') {
      loadDinnerRegistrations();
    }
  }, [activeTab, searchTerm, statusFilter, cityFilter, loadUsers, loadDinnerRegistrations]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const SidebarItem = ({ id, icon, label, active, onClick }) => (
    <div
      onClick={() => onClick(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: '8px',
        margin: '4px 0',
        backgroundColor: active ? '#4F46E5' : 'transparent',
        color: active ? 'white' : '#6B7280',
        transition: 'all 0.2s ease',
        fontSize: '14px',
        fontWeight: active ? '600' : '500'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.backgroundColor = '#F3F4F6';
          e.target.style.color = '#374151';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#6B7280';
        }
      }}
    >
      <span style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '16px' }}>
        {icon}
      </span>
      {!sidebarCollapsed && <span>{label}</span>}
    </div>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '4px' 
          }}>
            {value}
          </div>
          <div style={{ 
            color: '#6B7280', 
            fontSize: '14px', 
            fontWeight: '500' 
          }}>
            {title}
          </div>
        </div>
        <div style={{
          fontSize: '24px',
          color: color,
          backgroundColor: `${color}15`,
          padding: '12px',
          borderRadius: '8px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px 16px',
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          {!sidebarCollapsed && (
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              Admin
            </h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              color: '#6B7280'
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              marginRight: '12px'
            }}>
              {currentUser.first_name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                {currentUser.first_name} {currentUser.last_name}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                Administrator
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav>
          <SidebarItem 
            id="dashboard" 
            icon="📊" 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={setActiveTab} 
          />
          <SidebarItem 
            id="users" 
            icon="👥" 
            label="Manage Users" 
            active={activeTab === 'users'} 
            onClick={setActiveTab} 
          />
          <SidebarItem 
            id="dinners" 
            icon="🍽️" 
            label="Dinner Registrations" 
            active={activeTab === 'dinners'} 
            onClick={setActiveTab} 
          />
          <SidebarItem 
            id="groups" 
            icon="👥" 
            label="Dinner Groups" 
            active={activeTab === 'groups'} 
            onClick={() => window.location.href = '/admin/groups'} 
          />
          <SidebarItem 
            id="events" 
            icon="🎉" 
            label="Manage Events" 
            active={activeTab === 'events'} 
            onClick={() => window.location.href = '/admin/events'} 
          />
        </nav>

        {/* Hide Menu Button */}
        {!sidebarCollapsed && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '16px',
            right: '16px'
          }}>
            <button
              onClick={() => setSidebarCollapsed(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                color: '#6B7280',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <span style={{ marginRight: '12px' }}>←</span>
              Hide Menu
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 2 }}>
        
        {/* Top Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'users' && 'Manage Users'}
            {activeTab === 'dinners' && 'Dinner Registrations'}
          </h2>
          
          {activeTab === 'users' && (
            <button style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Add User
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px' }}>
          
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && dashboardData && (
            <div>
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '24px',
                marginBottom: '32px'
              }}>
                <StatCard 
                  title="Total Users" 
                  value={dashboardData.statistics.total_users} 
                  icon="👥" 
                  color="#4F46E5" 
                />
                <StatCard 
                  title="Dinner Registrations" 
                  value={dashboardData.statistics.total_dinner_registrations} 
                  icon="🍽️" 
                  color="#059669" 
                />
                <StatCard 
                  title="Pending Dinners" 
                  value={dashboardData.statistics.pending_dinners} 
                  icon="⏳" 
                  color="#D97706" 
                />
                <StatCard 
                  title="Matched Dinners" 
                  value={dashboardData.statistics.matched_dinners} 
                  icon="✅" 
                  color="#10B981" 
                />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Registrations by City
                  </h3>
                  {dashboardData.city_stats.map((stat, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < dashboardData.city_stats.length - 1 ? '1px solid #F3F4F6' : 'none'
                    }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{stat.city}</span>
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#4F46E5'
                      }}>
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Budget Distribution
                  </h3>
                  {dashboardData.budget_stats.map((stat, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < dashboardData.budget_stats.length - 1 ? '1px solid #F3F4F6' : 'none'
                    }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{stat.budget}</span>
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#059669'
                      }}>
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Content */}
          {activeTab === 'users' && (
            <div>
              {/* Search Bar */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search User"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9CA3AF',
                      fontSize: '16px'
                    }}>
                      🔍
                    </span>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    User List
                  </h3>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    Loading...
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F9FAFB' }}>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            No
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Profile
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Email
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Role
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'right', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id} style={{ 
                            borderBottom: '1px solid #F3F4F6',
                            '&:hover': { backgroundColor: '#F9FAFB' }
                          }}>
                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6B7280' }}>
                              {index + 1}
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: '#4F46E5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginRight: '12px'
                                }}>
                                  {user.first_name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                    {user.first_name} {user.last_name}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {user.city}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>
                              {user.email}
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.role === 'admin' ? '#FEE2E2' : '#DBEAFE',
                                color: user.role === 'admin' ? '#DC2626' : '#2563EB'
                              }}>
                                {user.role === 'admin' ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => toggleUserRole(user.id)}
                                  style={{
                                    padding: '6px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => toggleUserActive(user.id)}
                                  style={{
                                    padding: '6px 12px',
                                    border: '1px solid #FCA5A5',
                                    borderRadius: '6px',
                                    backgroundColor: 'white',
                                    color: '#DC2626',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>
                    Rows per page: 10
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                      1-10 of 50 items
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}>
                        ←
                      </button>
                      <button style={{
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}>
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dinner Registrations Content */}
          {activeTab === 'dinners' && (
            <div>
              {/* Filters */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="matched">Matched</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">All Cities</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Bandung">Bandung</option>
                  </select>
                </div>
              </div>

              {/* Registrations Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Dinner Registrations
                  </h3>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    Loading...
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F9FAFB' }}>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase'
                          }}>
                            User
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase'
                          }}>
                            City
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase'
                          }}>
                            Budget
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'left', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase'
                          }}>
                            Status
                          </th>
                          <th style={{ 
                            padding: '12px 24px', 
                            textAlign: 'right', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#6B7280',
                            textTransform: 'uppercase'
                          }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dinnerRegistrations.map((reg) => (
                          <tr key={reg.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: '#4F46E5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginRight: '12px'
                                }}>
                                  {reg.user.first_name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                    {reg.user.first_name} {reg.user.last_name}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {reg.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>
                              {reg.kota}
                            </td>
                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>
                              {reg.budget_preference}
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: 
                                  reg.status === 'pending' ? '#FEF3C7' :
                                  reg.status === 'matched' ? '#D1FAE5' :
                                  reg.status === 'completed' ? '#DBEAFE' : '#FEE2E2',
                                color: 
                                  reg.status === 'pending' ? '#D97706' :
                                  reg.status === 'matched' ? '#059669' :
                                  reg.status === 'completed' ? '#2563EB' : '#DC2626'
                              }}>
                                {reg.status}
                              </span>
                            </td>
                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                              <select
                                value={reg.status}
                                onChange={(e) => updateDinnerStatus(reg.id, e.target.value)}
                                style={{
                                  padding: '6px 12px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  outline: 'none'
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="matched">Matched</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
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

export default Admin; 