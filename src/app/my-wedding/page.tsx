"use client";
import BestManPhoto from "@/components/BestManPhoto/BestManPhoto";
import CopyWeddingCodeButton from "@/components/CopyWeddingCody/CopyWeddingCodeButton";
import CountdownTimer from "@/components/CountdownTimer";
import EditablePhoto from "@/components/EditablePhoto";
import FiancePhoto from "@/components/FiancePhoto/FiancePhoto";
import Navbar from "@/components/Navbar";
import { Product } from "@/components/Product";
import { weddingService } from "@/services/weddingService";
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Wedding {
  id: number;
  coupleName: string;
  weddingDate: string;
  weddingLocation: string;
  description: string;
  primaryColor: string;
  invitationCode?: string;
  couplePhotos?: string[];
  godparents?: Array<{
    name: string;
    photo?: string;
  }>;
  gifts?: Array<{
    id?: number;
    name: string;
    price: number;
    photo: string;
    description?: string;
  }>;
  footerPhoto?: string;
}

export default function MyWeddingPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const homeRef = useRef<HTMLDivElement>(null);
  const casalRef = useRef<HTMLDivElement>(null);
  const padrinhosRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const presentesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await weddingService.getMyWeddings();
        if (data && data.length > 0) {
          setWedding(data[0]);
        } else {
          setError("Nenhum casamento encontrado.");
        }
      } catch (err) {
        console.error("Erro ao carregar casamento:", err);
        setError("Erro ao carregar dados do casamento.");
      } finally {
        setLoading(false);
      }
    };
    fetchWedding();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: '#F8F8F8' }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !wedding) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: '#F8F8F8' }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error || "Nenhum casamento encontrado."}
        </Alert>
      </Box>
    );
  }

  const coupleNames = wedding.coupleName.split(' e ');
  const primaryColor = wedding.primaryColor || "#138263";

  return (
    <Box sx={{ background: '#F8F8F8', minHeight: '100vh', paddingTop: '66.6px' }}>
      <Navbar
        primaryColor={primaryColor}
        showScrollNav={true}
        homeRef={homeRef}
        casalRef={casalRef}
        padrinhosRef={padrinhosRef}
        infoRef={infoRef}
        presentesRef={presentesRef}
        showAvatar={false}
      />
      
      {/* Seção do casal */}
      <Box 
        ref={casalRef}
        sx={{ 
          background: '#fff', 
          py: 5, 
          textAlign: 'center', 
          position: 'relative' 
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 400, 
              mb: 2,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            {wedding.coupleName}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src="/flores-nova.png" alt="Flores" width={310} height={205} />
          </Box>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 0.5 
            }}
          >
            {wedding.weddingDate}
          </Typography>
          
          {/* Botão do código do casamento */}
          {wedding.invitationCode && (
            <Box sx={{ mt: 3 }}>
              <CopyWeddingCodeButton
                code={wedding.invitationCode}
                primaryColor={primaryColor}
                textColor="#fff"
              />
            </Box>
          )}
        </Container>
      </Box>

      {/* Contagem regressiva */}
      <Box 
        sx={{ 
          background: primaryColor, 
          color: '#fff', 
          py: 4, 
          textAlign: 'center' 
        }}
      >
        <Container maxWidth="md">
          <CountdownTimer targetDate={wedding.weddingDate} size="large" />
        </Container>
      </Box>

      {/* O Casal */}
      <Box sx={{ background: '#fff', py: 4, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
            O CASAL
          </Typography>
          
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FiancePhoto 
                text={coupleNames[0]} 
                editable={false} 
                initialPhoto={wedding.couplePhotos?.[0]} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FiancePhoto 
                text={coupleNames[1] || ''} 
                editable={false} 
                initialPhoto={wedding.couplePhotos?.[1]} 
              />
            </Grid>
          </Grid>
          
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                minHeight: 80,
                lineHeight: 1.6
              }}
            >
              {wedding.description}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Os Padrinhos */}
      <Box ref={padrinhosRef} sx={{ background: '#fff', py: 4, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
            OS PADRINHOS
          </Typography>
          
          <Grid 
            container 
            spacing={3} 
            justifyContent="center"
            sx={{ 
              maxWidth: 600, 
              mx: 'auto' 
            }}
          >
            {wedding.godparents?.map((padrinho, idx) => (
              <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <BestManPhoto 
                    text={padrinho.name} 
                    size={80} 
                    editable={false} 
                    showDelete={false} 
                    initialPhoto={padrinho.photo} 
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Informações */}
      <Box 
        ref={infoRef}
        sx={{ 
          background: primaryColor, 
          color: '#fff', 
          py: 4, 
          textAlign: 'center' 
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            INFORMAÇÕES
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            {wedding.weddingLocation}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <img src="/flores-nova.png" alt="Flores" width={310} height={205} />
          </Box>
          
          <Typography variant="h6">
            {wedding.weddingDate}
          </Typography>
        </Container>
      </Box>

      {/* Lista de Presentes */}
      <Box ref={presentesRef} sx={{ background: '#fff', py: 4, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
            LISTA DE PRESENTES
          </Typography>
          
          <Grid 
            container 
            spacing={3} 
            justifyContent="center"
            sx={{ maxWidth: 1200, mx: 'auto' }}
          >
            {wedding.gifts?.map((produto, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                <Product 
                  id={produto.id || (idx + 1)} 
                  name={produto.name} 
                  description={produto.description || produto.name}
                  price={produto.price} 
                  image={produto.photo} 
                  primaryColor={primaryColor}
                  editable={false} 
                  showDelete={false} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mensagem final */}
      <Box sx={{ background: '#fff', py: 4, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            CONTAMOS COM SUA PRESENÇA!
          </Typography>
          
          {wedding.footerPhoto && (
            <Box sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
              <EditablePhoto 
                src={wedding.footerPhoto} 
                alt="Casal" 
                width={600} 
                height={200} 
                style={{ borderRadius: 16, objectFit: 'cover' }} 
                editable={false} 
              />
            </Box>
          )}
          
          <Typography variant="body1" color="text.secondary">
            Com carinho, {wedding.coupleName}.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
