import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : '';
    });

    const [role, setRole] = useState(() => {
        const savedRole = sessionStorage.getItem('role');
        return savedRole ? JSON.parse(savedRole) : '';
    });

    const [nama_lengkap, setNamaLengkap] = useState(() => {
        const savedNamaLengkap = sessionStorage.getItem('nama_lengkap');
        return savedNamaLengkap ? JSON.parse(savedNamaLengkap) : '';
    });

    const login = (username, role, nama_lengkap) => {
        setUser(username);
        setRole(role);
        setNamaLengkap(nama_lengkap);

        sessionStorage.setItem('user', JSON.stringify(username));
        sessionStorage.setItem('role', JSON.stringify(role));
        sessionStorage.setItem('nama_lengkap', JSON.stringify(nama_lengkap));
    };

    const logout = () => {
        setUser('');
        setRole('');
        setNamaLengkap('');

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('nama_lengkap');
    };

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        const savedRole = sessionStorage.getItem('role');
        const savedNamaLengkap = sessionStorage.getItem('nama_lengkap');
        
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedRole) {
            setRole(JSON.parse(savedRole));
        }
        if (savedNamaLengkap) {
            setNamaLengkap(JSON.parse(savedNamaLengkap));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, nama_lengkap, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
