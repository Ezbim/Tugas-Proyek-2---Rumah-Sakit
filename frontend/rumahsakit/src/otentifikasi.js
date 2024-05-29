import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const Otentifikasi = () => {
    const [mode, setMode] = useState('login'); // State to track login/register mode
    const [feedback, setFeedback] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setFeedback('');
    };

  

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setFeedback('Login successful!');
                login(data.username,data.role,data.nama_lengkap); // Set the username globally
                console.log(data)
                navigate('/');
            } else {
                setFeedback('Login failed: ' + data.message);
            }
        } catch (error) {
            setFeedback('Error during login: ' + error.message);
        }
    };

    const handleRegister = async (nama_lengkap,dokter_id, username, password, role) => {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nama_lengkap,dokter_id, username, password, role }),
            });
            const data = await response.json();
            if (response.ok) {
                setFeedback('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    switchMode(); // Switch to login mode after successful registration
                }, 2000);
            } else {
                setFeedback('Registration failed: ' + data.message);
            }
        } catch (error) {
            setFeedback('Error during registration: ' + error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          
            {mode === 'login' && <Login switchMode={switchMode} onLogin={handleLogin} />}
            {mode === 'register' && <Register switchMode={switchMode} onRegister={handleRegister} />}  
            {feedback && <p className="mt-4 text-center text-red-500">{feedback}</p>}
        </div>
    );
};

const Login = ({ switchMode, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="login">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Login
                </button>
                <p className="mt-4 text-center">Belum punya akun ? <span onClick={switchMode} className="text-blue-500 cursor-pointer">Register disini</span></p>
            </form>
        </div>
    );
};

const Register = ({ switchMode, onRegister }) => {
    const [nama_lengkap, setNamaLengkap] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [dokter_id, setdokter_id] = useState(''); 
    const [role, setRole] = useState('pasien');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(nama_lengkap, dokter_id, username, password, role);
    };
  
    return (
        <div className="register">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="pasien">Pasien</option>
                        <option value="dokter">Dokter</option>
                    </select>
                </div>
                {role === 'pasien' ? (
                <div className="mb-4">
                    <label htmlFor="nama_lengkap" className="block text-gray-700">Full Name:</label>
                    <input
                        type="text"
                        id="nama_lengkap"
                        value={nama_lengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                ):(
                    <div className="mb-4">
                    <label htmlFor="nama_lengkap" className="block text-gray-700">ID Dokter :</label>
                    <input
                        type="text"
                        id="dokter_id"
                        value={dokter_id}
                        onChange={(e) => setdokter_id(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                )}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
              
                <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
                <p className="mt-4 text-center">Sudah punya akun? <span onClick={switchMode} className="text-blue-500 cursor-pointer">Login disini</span></p>
            </form>
        </div>
    );
};

export default Otentifikasi;
