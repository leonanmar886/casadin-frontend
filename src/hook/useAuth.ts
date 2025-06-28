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

  // Carrega o perfil do usuário se houver token
  useEffect(() => {
    const loadProfile = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch {
        setUser(null);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
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