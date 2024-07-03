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
import Entitas from './entitas';


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
            element={
              <ProtectedRoute
                element={<Pendaftaran />}
                condition={role === 'admin' || role === 'petugas pendaftaran'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
          <Route
            path="/antrian"
            element={
              <ProtectedRoute
                element={<Antrian />}
                condition={role === 'admin' || role === 'petugas antrian'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
          <Route
            path="/otentifikasi"
            element={user === '' ? <Otentifikasi /> : <LandingPage />}
          />
          <Route
            path="/RekamMedis"
            element={
              <ProtectedRoute
                element={<RekamMedis />}
                condition={role === 'admin' || role === 'dokter' || role === 'petugas rekam medis'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
          <Route
            path="/RawatInap"
            element={
              <ProtectedRoute
                element={<RawatInap />}
                condition={role === 'admin' || role === 'dokter' || role === 'petugas rawat inap'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
          <Route
            path="/RawatJalan"
            element={
              <ProtectedRoute
                element={<RawatJalan />}
                condition={role === 'admin' || role === 'dokter' || role === 'petugas rawat jalan'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
          <Route
            path="/Pasien"
            element={
              <ProtectedRoute
                element={<Pasien />}
                condition={role === 'dokter'}
                alertMessage="Access Denied: Anda Bukan Dokter."
              />
            }
          />
          <Route
            path="/entitas"
            element={
              <ProtectedRoute
                element={<Entitas />}
                condition={role === 'admin' || role === 'petugas entitas'}
                alertMessage="Access Denied: Anda Tidak Memiliki Akses."
              />
            }
          />
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;
