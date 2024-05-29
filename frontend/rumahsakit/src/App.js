import React from 'react';
import Pendaftaran from './pendaftaran';
import Navigation from './components/navigation';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './landingPage';

import Otentifikasi from './otentifikasi';
import { AuthProvider, useAuth } from './AuthContext';
import RawatInap from './rawatInap';
import RekamMedis from './rekamMedis';
import RawatJalan from './rawatJalan';
import Pasien from './pasien';
import UnAuthenticated from './unauthenticated';


function App() {
  const {user,role} = useAuth()
  return (
    

      <AuthProvider>
        <Router>
        <div className="app font-sans">

          <Navigation />

          <div className="display overflow-auto my-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pendaftaran" element={<Pendaftaran />} />
              <Route path="/otentifikasi" element={user === '' ? (<Otentifikasi />): (<LandingPage />) }/> 
              <Route path="/RekamMedis" element={role.role === 'pasien' ? (<RekamMedis />): (<UnAuthenticated />)} />
              <Route path="/RawatInap" element={role.role === 'dokter' ? (<RawatInap />): (<UnAuthenticated />) }/>
              <Route path="/RawatJalan" element={role.role === 'dokter' ? (<RawatJalan />): (<UnAuthenticated />) }/>
              <Route path="/Pasien" element={role.role === 'dokter' ? (<Pasien />): (<UnAuthenticated />) }/>
            
            </Routes>
          </div>

        </div>
      </Router>
      </AuthProvider>
      
    
  );
}

export default App;
