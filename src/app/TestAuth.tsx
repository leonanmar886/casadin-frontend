'use client';
import { useState } from 'react';
import { useAuth } from '../hook/useAuth';

export default function TestAuth() {
  const { user, loading, login, register, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'fiance' | 'guest'>('fiance');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login({ email, password });
    } catch {
      setError('Erro ao fazer login');
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      await register({ name, email, password, role });
    } catch {
      setError('Erro ao registrar');
    }
  };

  return (
    <div>
      <h2>Teste de Autenticação</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isAuthenticated ? (
        <div>
          <input
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select value={role} onChange={e => setRole(e.target.value as 'fiance' | 'guest')}>
            <option value="fiance">Noivo(a)</option>
            <option value="guest">Convidado(a)</option>
          </select>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      ) : (
        <div>
          <p>Usuário logado: {user?.name} ({user?.email})</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}