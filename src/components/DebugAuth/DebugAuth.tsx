import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hook/useAuth';

export const DebugAuth: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setToken(localStorage.getItem('auth_token'));
  }, []);

  const checkAuth = () => {
    console.log('=== DEBUG AUTH ===');
    console.log('User:', user);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('Token Value:', token);
    console.log('==================');
  };

  if (!isClient) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Debug de Autenticação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Carregando...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Debug de Autenticação
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Usuário Logado:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}
          </Typography>
          <Typography variant="body2">
            <strong>Token Presente:</strong> {token ? '✅ Sim' : '❌ Não'}
          </Typography>
          {user && (
            <Typography variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
          )}
        </Box>

        <Button variant="outlined" onClick={checkAuth} size="small">
          Verificar no Console
        </Button>

        {!isAuthenticated && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Você precisa estar logado para testar pagamentos
          </Alert>
        )}

        {!token && isAuthenticated && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Token não encontrado no localStorage
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 