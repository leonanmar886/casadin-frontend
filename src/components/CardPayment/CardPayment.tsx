import { CardPayment } from '@mercadopago/sdk-react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getDefaultInitialization, initializeMercadoPagoReact } from '../../config/mercadopago-react';
import { paymentService } from '../../services/paymentService';

interface CardPaymentProps {
  giftId: number;
  amount: number;
  payerEmail: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const CardPaymentComponent: React.FC<CardPaymentProps> = ({
  giftId,
  amount,
  payerEmail,
  onSuccess,
  onError: onErrorProp,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [brickError, setBrickError] = useState<string>('');

  // Inicializar Mercado Pago SDK React
  useEffect(() => {
    initializeMercadoPagoReact();
  }, []);

  // Configuração de inicialização do Brick
  const initialization = getDefaultInitialization(amount, payerEmail);

  // Callback quando o Brick está pronto
  const onReady = () => {
    setPaymentStatus('Formulário carregado');
    setBrickError('');
  };

  // Callback quando o usuário submete o formulário
  const onSubmit = async (formData: { token: string }) => {
    setLoading(true);
    setPaymentStatus('Processando pagamento...');

    try {
      const payment = await paymentService.createCardPayment(
        giftId,
        amount,
        formData.token, // Token gerado pelo Brick
        payerEmail
      );

      if (payment.status === 'approved') {
        setPaymentStatus('Pagamento aprovado!');
        setTimeout(() => onSuccess(), 2000);
      } else if (payment.status === 'pending') {
        setPaymentStatus('Pagamento pendente - aguardando confirmação');
        setTimeout(() => onSuccess(), 3000); // Consider success even if pending for now
      } else {
        setPaymentStatus(`Status: ${payment.status}`);
        onErrorProp(`Pagamento não aprovado: ${payment.status}`);
      }
    } catch (error) {
      setPaymentStatus('Erro no pagamento');
      onErrorProp('Erro ao processar pagamento. Verifique os dados do cartão.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    if (status.includes('aprovado')) return 'success';
    if (status.includes('erro') || status.includes('rejeitado')) return 'error';
    if (status.includes('pendente')) return 'warning';
    return 'info';
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Pagamento com Cartão
          </Typography>
          
          <Typography variant="h4" component="div" align="center" color="primary" gutterBottom>
            R$ {typeof amount === 'number' ? amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
          </Typography>

          {paymentStatus && (
            <Box mb={2}>
              <Chip
                label={paymentStatus}
                color={getStatusColor(paymentStatus)}
                sx={{ width: '100%' }}
              />
            </Box>
          )}

          {brickError && (
            <Box mb={2}>
              <Alert severity="warning">
                {brickError}
              </Alert>
            </Box>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {/* Card Payment Brick usando SDK React */}
          <Box sx={{ minHeight: '400px' }}>
            <CardPayment
              initialization={initialization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={(error) => {
                setPaymentStatus('Erro no formulário');
                setBrickError('Erro ao carregar formulário de pagamento');
                onErrorProp('Erro no formulário de pagamento');
              }}
            />
          </Box>

          {/* Botão de cancelar */}
          <Box mt={3}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{ width: '100%' }}
            >
              Cancelar
            </Button>
          </Box>

          {/* Informações de segurança */}
          <Box mt={3}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Informações de Segurança:</strong>
              </Typography>
              <Stack spacing={0.5} mt={1}>
                <Typography variant="body2">• Seus dados são protegidos e criptografados</Typography>
                <Typography variant="body2">• Não armazenamos informações do seu cartão</Typography>
                <Typography variant="body2">• Pagamento processado pelo Mercado Pago</Typography>
                <Typography variant="body2">• Aceitamos cartões de crédito e débito</Typography>
              </Stack>
            </Alert>
          </Box>

          {/* Informações sobre parcelamento */}
          <Box mt={2}>
            <Alert severity="success">
              <Typography variant="body2">
                <strong>💳 Parcelamento:</strong> Pagamento em até 12x sem juros
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 