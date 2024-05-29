import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [role, setRole] = useState('')
    const [nama_lengkap, setnama_lengkap] = useState('')
    const login = (username,role,nama_lengkap) => {
        setUser({ username });
        setRole({role})
        setnama_lengkap({nama_lengkap})
    };

    const logout = () => {
        setUser('');
        setRole('');
        setnama_lengkap('')
    };

    return (
        <AuthContext.Provider value={{ user,role,nama_lengkap, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
