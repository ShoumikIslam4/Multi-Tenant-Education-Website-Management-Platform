import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types/index.js';
import { useTenant } from './TenantContext.js';

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'PUBLIC',
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  switchRole: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('PUBLIC');
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant } = useTenant();

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role);
      } else {
        setUser(null);
        setRole('PUBLIC');
      }
    } catch (e) {
      setUser(null);
      setRole('PUBLIC');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, targetRole?: Role): Promise<boolean> => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tenantId: currentTenant?.id || 'tenant-dhaka-model'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const switchRole = async (newRole: Role) => {
    if (newRole === 'PUBLIC') {
      setUser(null);
      setRole('PUBLIC');
      return;
    }

    // Map role to authentic demo account
    const roleEmailMap: Record<Role, string> = {
      SUPER_ADMIN: 'superadmin@schoolos.net',
      SCHOOL_ADMIN: currentTenant?.id === 'tenant-cstc' ? 'admin@cstc.edu.bd' : 'admin@dhakamodel.edu.bd',
      EDITOR: 'editor@dhakamodel.edu.bd',
      TEACHER: 'teacher@dhakamodel.edu.bd',
      STUDENT: 'student@dhakamodel.edu.bd',
      GUARDIAN: 'guardian@dhakamodel.edu.bd',
      PUBLIC: '',
    };

    const targetEmail = roleEmailMap[newRole];
    if (targetEmail) {
      await login(targetEmail, newRole);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setRole('PUBLIC');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
