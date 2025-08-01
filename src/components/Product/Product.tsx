import { Info, Payment } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hook/useAuth';
import { weddingService } from '../../services/weddingService';
import { PaymentModal } from '../PaymentModal/PaymentModal';

interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
  primaryColor?: string;
  onPaymentSuccess?: () => void;
  editable?: boolean;
  showDelete?: boolean;
  onNameChange?: (newName: string) => void;
  onPriceChange?: (newPrice: number) => void;
  onImageChange?: (newImage: string) => void;
  onDelete?: () => void;
}

interface PaymentStats {
  id: number;
  name: string;
  price: string;
  amountPaid: string;
  amountRemaining: string;
  isFullyPaid: boolean;
  progressPercentage: number;
  paymentStatus: string;
  paidAt: string | null;
}

export const Product: React.FC<ProductProps> = ({
  id,
  name,
  description,
  price,
  image,
  primaryColor = '#1976d2',
  onPaymentSuccess
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(typeof price === 'string' ? parseFloat(price) : price);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Buscar estatísticas de pagamento
  useEffect(() => {
    const fetchPaymentStats = async () => {
      // Não tentar buscar se o ID for inválido (0 ou negativo)
      if (!id || id <= 0) {
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);
        const stats = await weddingService.getGiftPaymentStats(id);
        setPaymentStats(stats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas de pagamento:', error);
        // Se não conseguir carregar, não mostra a barra de progresso
      } finally {
        setLoadingStats(false);
      }
    };

    fetchPaymentStats();
  }, [id]);

  const handlePaymentClick = () => {
    if (!isAuthenticated || !user) {
      setNotificationMessage('Você precisa estar logado para fazer um pagamento');
      setNotificationSeverity('warning');
      setShowNotification(true);
      return;
    }

    if (customAmount <= 0) {
      setNotificationMessage('Por favor, insira um valor válido para o presente');
      setNotificationSeverity('error');
      setShowNotification(true);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setIsProcessing(false);
    
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    
    // Recarregar estatísticas após pagamento bem-sucedido
    const reloadStats = async () => {
      // Não tentar recarregar se o ID for inválido
      if (!id || id <= 0) {
        return;
      }

      try {
        const stats = await weddingService.getGiftPaymentStats(id);
        setPaymentStats(stats);
      } catch (error) {
        console.error('Erro ao recarregar estatísticas:', error);
      }
    };
    reloadStats();
    
    setNotificationMessage('Pagamento realizado com sucesso! Obrigado pela contribuição.');
    setNotificationSeverity('success');
    setShowNotification(true);
  };

  const handlePaymentError = (message: string) => {
    console.error('Erro no pagamento:', message);
    setIsProcessing(false);
    
    setNotificationMessage(`Erro no pagamento: ${message}`);
    setNotificationSeverity('error');
    setShowNotification(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setIsProcessing(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setCustomAmount(value);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const isAmountValid = customAmount > 0;
  const isUserLoggedIn = isAuthenticated && user;
  const actualPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Determinar cor da barra de progresso baseada no percentual
  const getProgressColor = (percentage: number): 'success' | 'info' | 'warning' | 'error' => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 350,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 8
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h3" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
          
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Chip
              label={`R$ ${typeof price === 'number' ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                typeof price === 'string' ? parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}`}
              sx={{ 
                fontSize: '1.1rem', 
                fontWeight: 600,
                borderColor: primaryColor,
                color: primaryColor
              }}
              variant="outlined"
            />
          </Box>

          {/* Barra de Progresso do Pagamento */}
          {!loadingStats && paymentStats && paymentStats.progressPercentage !== undefined && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progresso do Presente
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: primaryColor }}>
                  {paymentStats.progressPercentage?.toFixed(1) || '0.0'}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={Math.min(paymentStats.progressPercentage || 0, 100)}
                color={getProgressColor(paymentStats.progressPercentage || 0)}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  R$ {parseFloat(paymentStats.amountPaid || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pagos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {paymentStats.isFullyPaid ? 'Presente pago' : `R$ ${parseFloat(paymentStats.amountRemaining || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} restante`}
                </Typography>
              </Box>
              
            </Box>
          )}

          {/* Fallback quando não há estatísticas */}
          {!loadingStats && (!paymentStats || paymentStats.progressPercentage === undefined) && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                📊 Estatísticas de contribuição serão exibidas aqui
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                ID do presente: {id} (ID válido: {id > 0 ? 'Sim' : 'Não'})
              </Typography>
            </Box>
          )}

          {/* Debug quando está carregando */}
          {loadingStats && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="info.main">
                🔄 Carregando estatísticas...
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                ID do presente: {id} | Fazendo requisição para /weddings/gifts/{id}/payment-stats
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Valor da contribuição
              </Typography>
              <Tooltip title="Você pode contribuir com um valor personalizado">
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              label="Valor personalizado (opcional)"
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              fullWidth
              size="small"
              error={!isAmountValid && customAmount !== actualPrice}
              helperText={!isAmountValid && customAmount !== actualPrice ? 'Valor deve ser maior que zero' : ''}
              inputProps={{
                min: 0.01,
                step: 0.01
              }}
            />
          </Box>

          {!isUserLoggedIn && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Faça login para contribuir com este presente
              </Typography>
            </Alert>
          )}

          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={handlePaymentClick}
            disabled={!isUserLoggedIn || !isAmountValid || isProcessing}
            fullWidth
            size="large"
            sx={{
              mt: 'auto',
              background: `linear-gradient(45deg, ${primaryColor}, ${primaryColor}dd)`,
              '&:hover': {
                background: `linear-gradient(45deg, ${primaryColor}dd, ${primaryColor})`
              },
              '&:disabled': {
                background: 'grey.300'
              }
            }}
          >
            {isProcessing ? 'Processando...' : 'Contribuir com Presente'}
          </Button>

          {!isUserLoggedIn && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                💝 Contribua para tornar este momento ainda mais especial
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        giftId={id}
        amount={customAmount}
        payerEmail={user?.email || ''}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notificationSeverity} 
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
};