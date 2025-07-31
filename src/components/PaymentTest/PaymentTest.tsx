import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../hook/useAuth';
import { DebugAuth } from '../DebugAuth/DebugAuth';
import { PaymentModal } from '../PaymentModal/PaymentModal';

interface TestPaymentData {
  giftId: number;
  amount: number;
  description: string;
  testScenario: 'success' | 'pending' | 'rejected' | 'error';
}

export const PaymentTest: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [testData, setTestData] = useState<TestPaymentData>({
    giftId: 1,
    amount: 50.00,
    description: 'Teste de Pagamento',
    testScenario: 'success'
  });
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user } = useAuth();

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handlePaymentSuccess = () => {
    addTestResult('✅ Pagamento realizado com sucesso!');
    setShowPaymentModal(false);
  };

  const handlePaymentError = (message: string) => {
    addTestResult(`❌ Erro no pagamento: ${message}`);
  };

  const handleStartTest = () => {
    if (!user) {
      addTestResult('⚠️ Usuário não está logado');
      return;
    }
    
    addTestResult(`🚀 Iniciando teste: ${testData.description}`);
    addTestResult(`💰 Valor: R$ ${testData.amount.toFixed(2)}`);
    addTestResult(`🎯 Cenário: ${testData.testScenario}`);
    setShowPaymentModal(true);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Teste de Pagamentos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Use este componente para testar diferentes cenários de pagamento
      </Typography>

      {/* Debug de Autenticação */}
      <DebugAuth />

      <Grid container spacing={3}>
        {/* Configuração do Teste */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuração do Teste
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="ID do Presente"
                  type="number"
                  value={testData.giftId}
                  onChange={(e) => setTestData(prev => ({ ...prev, giftId: Number(e.target.value) }))}
                  fullWidth
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Valor (R$)"
                  type="number"
                  value={testData.amount}
                  onChange={(e) => setTestData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  fullWidth
                  size="small"
                  inputProps={{ step: 0.01, min: 0.01 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Descrição"
                  value={testData.description}
                  onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cenário de Teste</InputLabel>
                  <Select
                    value={testData.testScenario}
                    onChange={(e) => setTestData(prev => ({ ...prev, testScenario: e.target.value as any }))}
                    label="Cenário de Teste"
                  >
                    <MenuItem value="success">✅ Sucesso</MenuItem>
                    <MenuItem value="pending">⏳ Pendente</MenuItem>
                    <MenuItem value="rejected">❌ Rejeitado</MenuItem>
                    <MenuItem value="error">🚨 Erro</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={handleStartTest}
                fullWidth
                disabled={!user}
              >
                Iniciar Teste
              </Button>

              {!user && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Você precisa estar logado para testar pagamentos
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Resultados dos Testes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Resultados dos Testes
                </Typography>
                <Button size="small" onClick={clearResults}>
                  Limpar
                </Button>
              </Box>
              
              <Box
                sx={{
                  height: 300,
                  overflowY: 'auto',
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                {testResults.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum teste executado ainda
                  </Typography>
                ) : (
                  testResults.map((result, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {result}
                    </Typography>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informações de Teste */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Informações para Testes
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                🧪 Cartões de Teste (Sandbox):
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">
                  <strong>Mastercard:</strong> 5031 4332 1540 6351 | CVC: 123 | Data: 11/25
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Visa:</strong> 4509 9535 6623 3704 | CVC: 123 | Data: 11/25
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>American Express:</strong> 3711 8030 3257 522 | CVC: 1234 | Data: 11/25
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                🔍 Cenários de Teste:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">
                  <strong>Sucesso:</strong> Pagamento aprovado normalmente
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Pendente:</strong> Pagamento aguardando confirmação
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Rejeitado:</strong> Pagamento negado pelo banco
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Erro:</strong> Falha na comunicação
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        giftId={testData.giftId}
        amount={testData.amount}
        payerEmail={user?.email || ''}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </Box>
  );
}; 