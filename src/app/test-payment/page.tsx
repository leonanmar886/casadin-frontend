"use client";
import { Box, Container, Grid, Typography } from '@mui/material';
import { Product } from '../../components/Product/Product';
import { useAuth } from '../../hook/useAuth';

export default function TestPaymentPage() {
  const { user, isAuthenticated } = useAuth();

  const sampleGifts = [
    {
      id: 1,
      name: "Air Fryer",
      description: "Air Fryer para cozinhar de forma mais saudável",
      price: 299.99,
      image: "/airfryer.png"
    },
    {
      id: 2,
      name: "Jogo de Panelas",
      description: "Conjunto completo de panelas antiaderentes",
      price: 199.99,
      image: "/airfryer.png"
    },
    {
      id: 3,
      name: "Mixer",
      description: "Mixer para preparar sucos e vitaminas",
      price: 89.99,
      image: "/airfryer.png"
    },
    {
      id: 4,
      name: "Jogo de Copos",
      description: "Conjunto de copos de cristal",
      price: 150.00,
      image: "/airfryer.png"
    },
    {
      id: 5,
      name: "Toalhas de Mesa",
      description: "Jogo de toalhas de mesa bordadas",
      price: 75.50,
      image: "/airfryer.png"
    },
    {
      id: 6,
      name: "Vasos Decorativos",
      description: "Par de vasos para decoração",
      price: 120.00,
      image: "/airfryer.png"
    }
  ];

  const handlePaymentSuccess = (giftId: number) => {
    console.log(`Pagamento realizado com sucesso para o presente ${giftId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🧪 Teste de Integração de Pagamentos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Teste a integração completa de pagamentos com presentes
        </Typography>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            <strong>Status do Usuário:</strong> {isAuthenticated ? '✅ Logado' : '❌ Não logado'}
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {user.email}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {sampleGifts.map((gift) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={gift.id}>
            <Product
              id={gift.id}
              name={gift.name}
              description={gift.description}
              price={gift.price}
              image={gift.image}
              onPaymentSuccess={() => handlePaymentSuccess(gift.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📋 Instruções de Teste:
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>✅ Teste sem estar logado - deve mostrar alerta de login</li>
            <li>✅ Teste com valor inválido - deve mostrar erro de validação</li>
            <li>✅ Teste com valor válido - deve abrir modal de pagamento</li>
            <li>✅ Teste Pix - deve abrir nova aba com QR code</li>
            <li>✅ Teste Cartão - deve carregar formulário do Mercado Pago</li>
            <li>✅ Barra de Progresso - mostra percentual já pago do presente</li>
            <li>✅ Cores da Barra - verde (100%), azul (75%+), amarelo (50%+), vermelho (&lt;50%)</li>
          </ul>
        </Typography>
      </Box>

      <Box sx={{ mt: 2, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Barra de Progresso:
        </Typography>
        <Typography variant="body2">
          A barra de progresso mostra o percentual já pago de cada presente. 
          Os dados são carregados da API <code>/weddings/gifts/{'{id}'}/payment-stats</code> e 
          incluem o total pago, número de contribuições e percentual de conclusão.
        </Typography>
      </Box>
    </Container>
  );
} 