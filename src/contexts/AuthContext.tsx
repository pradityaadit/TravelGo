import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage, generateId } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, phone: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      storage.setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string, phone: string): boolean => {
    const users = storage.getUsers();

    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: generateId(),
      email,
      password,
      name,
      phone,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.setUsers(users);
    setUser(newUser);
    storage.setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
