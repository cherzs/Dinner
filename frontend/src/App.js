import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import DaftarDinner from './pages/DaftarDinner';
import Admin from './pages/Admin';
import AdminGroups from './pages/AdminGroups';
import AdminEvents from './pages/AdminEvents';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/daftar-dinner" element={<DaftarDinner />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/groups" element={<AdminGroups />} />
            <Route path="/admin/events" element={<AdminEvents />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 