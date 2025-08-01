'use client';

import {
    Alert,
    Box,
    Container,
    Grid,
    Snackbar,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { PaymentModal } from '../../components/PaymentModal/PaymentModal';
import { Product } from '../../components/Product/Product';
import { useAuth } from '../../hook/useAuth';

// Dados de exemplo dos presentes
const sampleGifts = [
  {
    id: 1,
    name: 'Air Fryer',
    description: 'Fritadeira elétrica moderna para refeições mais saudáveis',
    price: 299.90,
    image: '/images/airfryer.jpg'
  },
  {
    id: 2,
    name: 'Jogo de Panelas',
    description: 'Conjunto completo de panelas antiaderentes',
    price: 450.00,
    image: '/images/panela.jpg'
  },
  {
    id: 3,
    name: 'Mixer Profissional',
    description: 'Mixer para preparar sucos e vitaminas',
    price: 89.90,
    image: '/images/mixer.jpg'
  },
  {
    id: 4,
    name: 'Jogo de Facas',
    description: 'Kit completo de facas de cozinha',
    price: 180.00,
    image: '/images/faca.jpg'
  }
];

export default function GiftsPage() {
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const { user } = useAuth();

  const handleGiftPayment = (gift: any) => {
    if (!user) {
      setNotification({
        open: true,
        message: 'Você precisa estar logado para contribuir com presentes',
        severity: 'warning'
      });
      return;
    }
    
    setSelectedGift(gift);
    setCustomAmount(gift.price);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedGift(null);
    setNotification({
      open: true,
      message: 'Obrigado pela contribuição! Seu presente foi registrado com sucesso.',
      severity: 'success'
    });
  };

  const handlePaymentError = (message: string) => {
    // Erro no pagamento
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedGift(null);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Lista de Presentes
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Escolha um presente e contribua para nossa casa nova!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {sampleGifts.map((gift) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={gift.id}>
            <Product
              id={gift.id}
              name={gift.name}
              description={gift.description}
              price={gift.price}
              image={gift.image}
              onPaymentSuccess={() => handleGiftPayment(gift)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de pagamento personalizado */}
      {selectedGift && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleCloseModal}
          giftId={selectedGift.id}
          amount={customAmount}
          payerEmail={user?.email || ''}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      {/* Notificação */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 