import { ContentCopy, OpenInNew } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MercadoPagoPaymentResponse, paymentService, PaymentStatusResponse } from '../../services/paymentService';

interface PixPaymentProps {
  giftId: number;
  amount: number;
  payerEmail: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  giftId,
  amount,
  payerEmail,
  onSuccess,
  onError,
  onCancel
}) => {
  const [payment, setPayment] = useState<MercadoPagoPaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [ticketUrl, setTicketUrl] = useState<string>('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [redirected, setRedirected] = useState(false);

  // Criar pagamento Pix
  const createPixPayment = async () => {
    setLoading(true);
    try {
      const paymentResponse = await paymentService.createPixPayment(giftId, amount, payerEmail);
      setPayment(paymentResponse);
      
      // Extrair dados do Pix
      const transactionData = paymentResponse.point_of_interaction?.transaction_data;
      if (transactionData) {
        setPixCode(transactionData.qr_code || '');
        setTicketUrl(transactionData.ticket_url || '');
        
        // Redirecionar automaticamente para o ticket_url se disponível
        if (transactionData.ticket_url && !redirected) {
          setRedirected(true);
          window.open(transactionData.ticket_url, '_blank');
        }
      }

      // Iniciar monitoramento de status
      startStatusPolling(paymentResponse.id);
    } catch (error) {
      console.error('Erro ao criar pagamento Pix:', error);
      onError('Erro ao criar pagamento Pix. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar monitoramento de status
  const startStatusPolling = (paymentId: number) => {
    const interval = paymentService.pollPaymentStatus(
      paymentId,
      (statusResponse: PaymentStatusResponse) => {
        setStatus(statusResponse.status);
        console.log('Status atualizado:', statusResponse.status);
      },
      (finalStatus: string) => {
        if (finalStatus === 'approved') {
          onSuccess();
        } else {
          onError(`Pagamento ${finalStatus}`);
        }
      },
      5000 // 5 segundos
    );
    setPollingInterval(interval);
  };

  // Copiar código Pix
  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      // Você pode adicionar uma notificação de sucesso aqui
    } catch (error) {
      console.error('Erro ao copiar código Pix:', error);
    }
  };

  // Abrir ticket_url em nova aba
  const openTicketUrl = () => {
    if (ticketUrl) {
      window.open(ticketUrl, '_blank');
    }
  };

  // Limpar interval quando componente for desmontado
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Criar pagamento quando componente montar
  useEffect(() => {
    createPixPayment();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={3}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Criando pagamento Pix...
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando pagamento';
      case 'approved':
        return 'Pagamento aprovado';
      case 'rejected':
        return 'Pagamento rejeitado';
      case 'cancelled':
        return 'Pagamento cancelado';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Pagamento via Pix
          </Typography>
          
          <Typography variant="h4" component="div" align="center" color="primary" gutterBottom>
            R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>

          {status && (
            <Box mb={2}>
              <Chip
                label={getStatusText(status)}
                color={getStatusColor(status) as any}
                sx={{ width: '100%' }}
              />
            </Box>
          )}

          {ticketUrl && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Pagar via Mercado Pago
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {redirected 
                  ? 'Uma nova aba foi aberta com a interface de pagamento. Se não abriu, clique no botão abaixo:'
                  : 'Clique no botão abaixo para abrir a interface de pagamento do Mercado Pago'
                }
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<OpenInNew />}
                onClick={openTicketUrl}
                sx={{ width: '100%' }}
                size="large"
              >
                {redirected ? 'Abrir Novamente' : 'Abrir Pagamento'}
              </Button>
            </Box>
          )}

          {pixCode && (
            <Box mb={3}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Código Pix (Copie e Cole)
              </Typography>
              
              {/* Botão copiar acima do campo */}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={copyPixCode}
                  sx={{ 
                    minWidth: '80px',
                    height: '32px',
                    fontSize: '0.75rem',
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  Copiar
                </Button>
              </Box>
              
              {/* Campo do código Pix */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  minHeight: '80px'
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                    m: 0,
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {pixCode}
                </Typography>
              </Box>
            </Box>
          )}

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Como pagar:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">1. Abra o app do seu banco</Typography>
              <Typography variant="body2">2. Escolha a opção "Pagar via Pix"</Typography>
              <Typography variant="body2">3. Escaneie o QR Code ou cole o código</Typography>
              <Typography variant="body2">4. Confirme o pagamento</Typography>
            </Stack>
          </Box>

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ width: '100%' }}
            >
              Cancelar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 