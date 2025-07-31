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
    console.log('Card Payment Brick pronto');
    setPaymentStatus('Formulário carregado');
    setBrickError('');
  };

  // Callback quando o usuário submete o formulário
  const onSubmit = async (formData: any) => {
    console.log('Dados do formulário:', formData);
    setLoading(true);
    setPaymentStatus('Processando pagamento...');

    try {
      // Enviar dados para o backend
      const payment = await paymentService.createCardPayment(
        giftId,
        amount,
        formData.token, // Token gerado pelo Brick
        payerEmail
      );

      console.log('Resposta do pagamento:', payment);

      if (payment.status === 'approved') {
        setPaymentStatus('Pagamento aprovado!');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else if (payment.status === 'pending') {
        setPaymentStatus('Pagamento pendente - aguardando confirmação');
        setTimeout(() => {
          onSuccess(); // Considerar sucesso mesmo pendente
        }, 3000);
      } else {
        setPaymentStatus(`Status: ${payment.status}`);
        onErrorProp(`Pagamento não aprovado: ${payment.status}`);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setPaymentStatus('Erro no pagamento');
      onErrorProp('Erro ao processar pagamento. Verifique os dados do cartão.');
    } finally {
      setLoading(false);
    }
  };

  // Callback para erros do Brick
  const onError = (error: any) => {
    console.error('Erro no Brick:', error);
    setPaymentStatus('Erro no formulário');
    setBrickError('Erro ao carregar formulário de pagamento');
    onErrorProp('Erro no formulário de pagamento');
  };

  const getStatusColor = (status: string) => {
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
            R$ {amount.toFixed(2)}
          </Typography>

          {paymentStatus && (
            <Box mb={2}>
              <Chip
                label={paymentStatus}
                color={getStatusColor(paymentStatus) as any}
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
              onError={onError}
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