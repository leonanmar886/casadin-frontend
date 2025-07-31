"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import CustomButton from "@/components/CustomButton/CustomButton";
import Image from 'next/image';
import FiancePhoto from '@/components/FiancePhoto/FiancePhoto';
import BestManPhoto from '@/components/BestManPhoto/BestManPhoto';
import CountdownTimer from '@/components/CountdownTimer';
import Product from '@/components/Product';
import EditablePhoto from '@/components/EditablePhoto';
import api from "@/services/api";

interface WeddingGuest {
  id: string;
  coupleName: string;
  weddingDate: string;
  weddingLocation: string;
  description: string;
  primaryColor: string;
  couplePhotos: string[];
  footerPhoto?: string;
  godparents: Array<{
    name: string;
    photo: string | null;
    relationship: string;
    description: string;
  }>;
  gifts: Array<{
    name: string;
    description: string;
    photo: string;
    price: number;
    store: string;
  }>;
}

export default function WeddingGuestByCodePage() {
  const { code } = useParams();
  const router = useRouter();
  const [wedding, setWedding] = useState<WeddingGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs para navegação
  const homeRef = React.useRef<HTMLDivElement>(null);
  const casalRef = React.useRef<HTMLDivElement>(null);
  const padrinhosRef = React.useRef<HTMLDivElement>(null);
  const infoRef = React.useRef<HTMLDivElement>(null);
  const presentesRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWeddingByCode = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        console.log('Buscando casamento pelo código:', code);
        
        try {
          const response = await api.get(`/weddings/invitation/${code}`);
          setWedding(response.data);
        } catch (directError) {
          console.log('Erro ao buscar diretamente:', directError);
          
          // Casamento de exemplo para teste
          setWedding({
            id: 'example-id',
            coupleName: 'Bru & Gui',
            weddingDate: '2024-12-31',
            weddingLocation: 'Igreja Nossa Senhora de Fátima - Bairro de Fátima',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed bibendum odio sem, in accumsan lacus vestibulum tincidunt. Pellentesque vitae faucibus mauris. Integer elit urna, egestas vel nibh non, tristique egestas diam.',
            primaryColor: '#138263',
            couplePhotos: ['/casal1.jpg', '/casal2.jpg'],
            footerPhoto: '/casal1.jpg',
            godparents: [
              { name: 'Padrinho 1', photo: null, relationship: 'Padrinho', description: 'Padrinho 1' },
              { name: 'Padrinho 2', photo: null, relationship: 'Padrinho', description: 'Padrinho 2' },
              { name: 'Padrinho 3', photo: null, relationship: 'Padrinho', description: 'Padrinho 3' },
            ],
            gifts: [
              { name: 'Air Fryer', description: 'Air Fryer', photo: '/airfryer.png', price: 299.90, store: 'Loja Online' },
              { name: 'Jogo de Panelas', description: 'Jogo de Panelas', photo: '/airfryer.png', price: 450.00, store: 'Loja Online' },
              { name: 'Mixer', description: 'Mixer', photo: '/airfryer.png', price: 180.00, store: 'Loja Online' },
            ]
          });
        }
      } catch (err) {
        console.error('Erro ao buscar casamento:', err);
        setError('Erro ao carregar o casamento ou código inválido');
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingByCode();
  }, [code]);

  // Função para converter data ISO para formato brasileiro
  const isoDateToBrazilian = (isoDate: string): string => {
    const date = new Date(isoDate);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();

    return `${day} de ${month} de ${year} às ${hour}h`;
  };

  // Função para extrair nomes do casal
  const getCoupleNames = () => {
    if (!wedding) return { noivo: 'Fulano', noiva: 'Fulana' };
    
    const names = wedding.coupleName.split(' e ');
    return {
      noivo: names[0] || 'Fulano',
      noiva: names[1] || 'Fulana'
    };
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F8F8F8',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#138263' }} />
        </Box>
      </ProtectedRoute>
    );
  }

  if (error || !wedding) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F8F8F8',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-figtree)',
              fontWeight: 600,
              fontSize: 24,
              color: '#FF3131',
              textAlign: 'center',
            }}
          >
            {error || 'Casamento não encontrado'}
          </Typography>
          <CustomButton
            onClick={() => router.push('/home')}
            sx={{
              bgcolor: '#138263',
              color: '#fff',
              '&:hover': { bgcolor: '#106b52' },
            }}
          >
            Voltar para Home
          </CustomButton>
        </Box>
      </ProtectedRoute>
    );
  }

  const coupleNames = getCoupleNames();
  const brazilianDate = isoDateToBrazilian(wedding.weddingDate);

  return (
    <ProtectedRoute>
      <div ref={homeRef} style={{ background: '#F8F8F8', minHeight: '100vh', paddingTop: '66.6px' }}>
        {/* Header */}
        <Navbar
          primaryColor={wedding.primaryColor}
          showScrollNav={true}
          homeRef={homeRef}
          casalRef={casalRef}
          padrinhosRef={padrinhosRef}
          infoRef={infoRef}
          presentesRef={presentesRef}
          showAvatar={false}
        />

        {/* Botão voltar */}
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            left: 20,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => router.push('/home')}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Seção do casal */}
        <section style={{ background: '#fff', padding: 64, textAlign: 'center', position: 'relative' }}>
          <h1 style={{ fontSize: 36, fontWeight: 400, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 400 }}>
              {coupleNames.noivo}
            </span>
            &
            <span style={{ fontSize: 36, fontWeight: 400 }}>
              {coupleNames.noiva}
            </span>
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <Image src="/flores-nova.png" alt="Flores" width={310} height={205} />
          </div>
          <div style={{ fontSize: 18, color: '#888' }}>
            {brazilianDate}
          </div>
        </section>

        {/* Contagem regressiva */}
        <section style={{ background: wedding.primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
          <CountdownTimer targetDate={brazilianDate} size="large" />
        </section>

        {/* O Casal */}
        <section ref={casalRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>O CASAL</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
            <FiancePhoto
              text={coupleNames.noivo}
              editable={false}
              initialPhoto={wedding.couplePhotos[0] || '/casal1.jpg'}
              onPhotoChange={() => {}}
            />
            <FiancePhoto
              text={coupleNames.noiva}
              editable={false}
              initialPhoto={wedding.couplePhotos[1] || '/casal2.jpg'}
              onPhotoChange={() => {}}
            />
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto', color: '#555', fontSize: 16 }}>
            {wedding.description}
          </div>
        </section>

        {/* Os Padrinhos */}
        {wedding.godparents && wedding.godparents.length > 0 && (
          <section ref={padrinhosRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>OS PADRINHOS</h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 120,
              justifyContent: 'center',
              marginBottom: 16,
              maxWidth: 400,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {wedding.godparents.map((godparent, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <BestManPhoto
                    text={godparent.name}
                    size={80}
                    editable={false}
                    showDelete={false}
                    onPhotoChange={() => {}}
                    onNameChange={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informações */}
        <section ref={infoRef} style={{ background: wedding.primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>INFORMAÇÕES</h1>
          <div style={{ fontSize: 18, marginBottom: 8 }}>
            {wedding.weddingLocation}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <Image src="/flores-nova.png" alt="Flores" width={310} height={205} />
          </div>
          <div style={{ fontSize: 18 }}>{brazilianDate}</div>
        </section>

        {/* Lista de Presentes */}
        {wedding.gifts && wedding.gifts.length > 0 && (
          <section ref={presentesRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>LISTA DE PRESENTES</h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
              justifyContent: 'center',
              marginBottom: 16,
              maxWidth: 1200,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {wedding.gifts.map((gift, index) => (
                <div key={index} style={{ margin: 8 }}>
                  <Product
                    id={index}
                    name={gift.name}
                    price={gift.price}
                    image={gift.photo}
                    editable={false}
                    showDelete={false}
                    onNameChange={() => {}}
                    onPriceChange={() => {}}
                    onImageChange={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mensagem final */}
        <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>CONTAMOS COM SUA PRESENÇA!</h1>
          <div style={{ margin: '0 auto 16px', maxWidth: 600 }}>
            <EditablePhoto
              src={wedding.footerPhoto || '/casal1.jpg'}
              alt="Casal"
              width={600}
              height={200}
              style={{ borderRadius: 16, objectFit: 'cover' }}
              onPhotoChange={() => {}}
              editable={false}
            />
          </div>
          <div style={{ color: '#555', fontSize: 16 }}>Com carinho, {coupleNames.noivo} & {coupleNames.noiva}.</div>
        </section>
      </div>
    </ProtectedRoute>
  );
} 