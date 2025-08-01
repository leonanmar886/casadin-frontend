import { Payment } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../hook/useAuth';
import { PaymentModal } from '../PaymentModal/PaymentModal';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  onPaymentSuccess?: () => void;
  editable?: boolean;
  showDelete?: boolean;
  onNameChange?: (newName: string) => void;
  onPriceChange?: (newPrice: number) => void;
  onImageChange?: (newImage: string) => void;
  onDelete?: () => void;
}

export const Product: React.FC<ProductProps> = ({
  id,
  name,
  description,
  price,
  image,
  editable = false,
  showDelete = false,
  onNameChange,
  onPriceChange,
  onImageChange,
  onDelete,
  onPaymentSuccess
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(price);
  const { user } = useAuth();

  const handlePaymentClick = () => {
    if (!user) {
      alert('Você precisa estar logado para fazer um pagamento');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    alert('Pagamento realizado com sucesso! Obrigado pela contribuição.');
  };

  const handlePaymentError = (message: string) => {
    console.error('Erro no pagamento:', message);
    // Você pode implementar uma notificação mais elegante aqui
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
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
              label={`R$ ${price.toFixed(2)}`}
              color="primary" 
              variant="outlined"
              size="large"
              sx={{ fontSize: '1.1rem', fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Valor personalizado (opcional)"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              fullWidth
              size="small"
              inputProps={{
                min: 1,
                step: 0.01
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Payment />}
            onClick={handlePaymentClick}
            fullWidth
            size="large"
            sx={{
              mt: 'auto',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)'
              }
            }}
          >
            Contribuir com Presente
          </Button>
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
    </>
  );
};