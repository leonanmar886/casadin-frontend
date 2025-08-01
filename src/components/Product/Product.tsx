import { Delete, Info, Payment } from '@mui/icons-material';
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
import EditablePhoto from '../EditablePhoto/EditablePhoto';
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
  onPaymentSuccess,
  editable,
  showDelete,
  onNameChange,
  onPriceChange,
  onImageChange,
  onDelete
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
      // Não tentar buscar se o ID for inválido (0 ou negativo) ou se estiver em modo de edição
      if (!id || id <= 0 || editable) {
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);
        const stats = await weddingService.getGiftPaymentStats(id);
        setPaymentStats(stats);
      } catch (error) {
        // Erro ao carregar estatísticas de pagamento
      } finally {
        setLoadingStats(false);
      }
    };

    fetchPaymentStats();
  }, [id, editable]);

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
        // Erro ao recarregar estatísticas
      } finally {
        setLoadingStats(false);
      }
    };
    reloadStats();
    
    setNotificationMessage('Pagamento realizado com sucesso! Obrigado pela contribuição.');
    setNotificationSeverity('success');
    setShowNotification(true);
  };

  const handlePaymentError = (message: string) => {
    // Erro no pagamento
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
        {image && image !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' ? (
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
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '2px dashed #ccc',
              color: '#666',
              textAlign: 'center',
              p: 2,
            }}
          >
            <Box
              sx={{
                fontSize: 48,
                mb: 1,
                color: '#999',
              }}
            >
              📷
            </Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: '#666',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Adicionar foto do presente
            </Typography>
          </Box>
        )}
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {editable ? (
            // Modo de edição
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                  value={name}
                  onChange={(e) => onNameChange?.(e.target.value)}
                  fullWidth
                  size="small"
                  label="Nome do presente"
                  sx={{ mr: 1 }}
                />
                {showDelete && (
                  <IconButton
                    onClick={onDelete}
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
              
              <TextField
                value={typeof price === 'number' ? price : parseFloat(price)}
                onChange={(e) => onPriceChange?.(parseFloat(e.target.value) || 0)}
                fullWidth
                size="small"
                label="Preço"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Imagem do presente
                </Typography>
                <EditablePhoto
                  src={image}
                  alt={name}
                  width={200}
                  height={150}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                  onPhotoChange={(newImage: string) => onImageChange?.(newImage)}
                  editable={true}
                />
              </Box>
            </>
          ) : (
            // Modo de visualização
            <>
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
            </>
          )}

          {/* Barra de Progresso do Pagamento - apenas quando não está editando */}
          {!editable && !loadingStats && paymentStats && paymentStats.progressPercentage !== undefined && (
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

          {/* Fallback quando não há estatísticas - apenas quando não está editando */}
          {!editable && !loadingStats && (!paymentStats || paymentStats.progressPercentage === undefined) && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                📊 Estatísticas de contribuição serão exibidas aqui
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                ID do presente: {id} (ID válido: {id > 0 ? 'Sim' : 'Não'})
              </Typography>
            </Box>
          )}

          {/* Debug quando está carregando - apenas quando não está editando */}
          {!editable && loadingStats && (
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

          {/* Campos de pagamento - apenas quando não está editando */}
          {!editable && (
            <>
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
            </>
          )}
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        giftId={id}
        amount={customAmount}
        payerEmail={user?.email || ''}
        primaryColor={primaryColor}
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