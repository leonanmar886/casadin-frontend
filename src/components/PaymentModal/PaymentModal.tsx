import { Close, CreditCard, QrCode } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { CardPaymentComponent } from '../CardPayment/CardPayment';
import { PixPayment } from '../PixPayment/PixPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: number;
  amount: number;
  payerEmail: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

type PaymentMethod = 'pix' | 'card' | null;

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  giftId,
  amount,
  payerEmail,
  onSuccess,
  onError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setErrorMessage('');
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    onError(message);
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    setErrorMessage('');
    onClose();
  };

  const handleClose = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
      setErrorMessage('');
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            {selectedMethod ? 'Pagamento' : 'Escolha a forma de pagamento'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!selectedMethod ? (
          <Box>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" color="primary" gutterBottom>
                R$ {amount.toFixed(2)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Selecione como deseja pagar:
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleMethodSelect('pix')}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          <QrCode sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h6" component="h3">
                          Pix
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Pagamento instantâneo via Pix
                        </Typography>
                        <Chip label="Recomendado" color="success" size="small" />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleMethodSelect('card')}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          <CreditCard sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h6" component="h3">
                          Cartão de Crédito
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Pagamento com cartão de crédito
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>

            {errorMessage && (
              <Box mt={2}>
                <Chip
                  label={errorMessage}
                  color="error"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            {selectedMethod === 'pix' && (
              <PixPayment
                giftId={giftId}
                amount={amount}
                payerEmail={payerEmail}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
              />
            )}

            {selectedMethod === 'card' && (
              <CardPaymentComponent
                giftId={giftId}
                amount={amount}
                payerEmail={payerEmail}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
              />
            )}
          </Box>
        )}
      </DialogContent>

      {!selectedMethod && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}; 