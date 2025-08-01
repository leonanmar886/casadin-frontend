import { useCallback, useEffect, useState } from 'react';
import { AuthResponse, authService, LoginDto, RegisterDto } from '../services/authService';

interface UseAuthReturn {
  user: AuthResponse['user'] | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Verificar se o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Carrega o perfil do usuário se houver token OU do localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const loadProfile = async () => {
      const token = authService.getToken();
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch {
        setUser(null);
        authService.logout();
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [mounted]);

  const login = useCallback(async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
} 