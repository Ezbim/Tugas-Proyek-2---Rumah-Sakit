import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Pendaftaran from './pendaftaran';
import Navigation from './components/navigation';
import LandingPage from './landingPage';
import Otentifikasi from './otentifikasi';
import { AuthProvider, useAuth } from './AuthContext';
import RawatInap from './rawatInap';
import RekamMedis from './rekamMedis';
import RawatJalan from './rawatJalan';
import Pasien from './pasien';
import Antrian from './antrian';

const UnAuthenticated = <Otentifikasi />;

const ProtectedRoute = ({ element, condition, alertMessage }) => {
  useEffect(() => {
    if (!condition) {
      alert(alertMessage);
    }
  }, [condition, alertMessage]);

  return condition ? element : UnAuthenticated;
};

function App() {
  const { user, role } = useAuth();

  return (
    <Router>
      <div className="app font-sans">
        <Navigation />
        <div className="display overflow-hidden my-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/pendaftaran" 
              element={<ProtectedRoute element={<Pendaftaran />} condition={role === 'petugas'} alertMessage="Access Denied: Anda Bukan Petugas." />} 
            />
            <Route 
              path="/antrian" 
              element={<ProtectedRoute element={<Antrian />} condition={role === 'petugas'} alertMessage="Access Denied: Anda Bukan Petugas." />} 
            />
            <Route 
              path="/otentifikasi" 
              element={user === '' ? UnAuthenticated : <LandingPage />} 
            />
            <Route 
              path="/RekamMedis" 
              element={<ProtectedRoute element={<RekamMedis />} condition={role === 'petugas'} alertMessage="Access Denied: Anda Bukan Petugas." />} 
            />
            <Route 
              path="/RawatInap" 
              element={<ProtectedRoute element={<RawatInap />} condition={role === 'petugas'} alertMessage="Access Denied: Anda Bukan Petugas." />} 
            />
            <Route 
              path="/RawatJalan" 
              element={<ProtectedRoute element={<RawatJalan />} condition={role === 'petugas'} alertMessage="Access Denied: Anda Bukan Petugas." />} 
            />
            <Route 
              path="/Pasien" 
              element={<ProtectedRoute element={<Pasien />} condition={role === 'dokter'} alertMessage="Access Denied: Anda Bukan Dokter." />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
