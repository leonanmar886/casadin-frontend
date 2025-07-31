"use client";
import AdornoHome from "@/components/AdornoHome/AdornoHome";
import CustomButton from "@/components/CustomButton/CustomButton";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthContext } from "@/providers/AuthProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import CustomModal from "@/components/CustomModal/CustomModal";
import { weddingService } from "@/services/weddingService";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Wedding {
  id: string;
  coupleName: string;
  weddingDate: string;
  footerPhoto?: string;
  primaryColor?: string;
  weddingLocation?: string;
  description?: string;
  isCreator?: boolean;
  role?: 'fiance' | 'guest';
}

export default function HomeProtected() {
  const { logout, user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loadingJoin, setLoadingJoin] = React.useState(false);
  const [errorJoin, setErrorJoin] = React.useState("");
  const [myWedding, setMyWedding] = useState<Wedding | null>(null);
  const [myInvitations, setMyInvitations] = useState<Wedding[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const router = useRouter();

  const handleSubmitCode = async () => {
    setLoadingJoin(true);
    setErrorJoin("");
    try {
      console.log('Tentando entrar no casamento com código:', code);
      console.log('Token atual:', localStorage.getItem('auth_token'));
      console.log('Usuário atual:', user);
      
      // Por enquanto, vamos navegar diretamente para a página do casamento
      // sem fazer o join, já que está dando erro 500
      setModalOpen(false);
      setCode("");
      router.push(`/wedding-guest/code/${code}`);
      
      // Comentando o join temporariamente devido ao erro 500
      /*
      const response = await weddingService.joinWedding(code);
      console.log('Resposta do joinWedding:', response);
      
      // Se o join foi bem-sucedido, navegar para a página do casamento
      if (response && response.weddingId) {
        setModalOpen(false);
        setCode("");
        router.push(`/wedding-guest/${response.weddingId}`);
      } else {
        // Se não retornou weddingId, tentar buscar o casamento pelo código
        setModalOpen(false);
        setCode("");
        router.push(`/wedding-guest/code/${code}`);
      }
      */
    } catch (err: unknown) {
      console.error('Erro detalhado:', err);
      
      // Verificar se é um erro de rede ou servidor
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response) {
        const status = err.response.status;
        
        if (status === 404) {
          setErrorJoin("Código não existente");
        } else if (status === 400) {
          setErrorJoin("Código inválido");
        } else if (status === 409) {
          setErrorJoin("Você já está convidado para este casamento");
        } else if (status === 401) {
          setErrorJoin("Erro de autenticação. Faça login novamente.");
        } else if (status === 500) {
          setErrorJoin("Erro interno do servidor. Tente novamente em alguns instantes.");
        } else {
          setErrorJoin(`Erro ${status}: Tente novamente.`);
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        // Erro de rede ou outro tipo
        setErrorJoin("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        setErrorJoin("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchAllWeddings = async () => {
      try {
        setLoadingInvitations(true);
        const allWeddings = await weddingService.getAllMyWeddings();
        console.log('Todos os casamentos carregados:', allWeddings);
        
        // Separar casamentos criados vs convites
        const createdWeddings = allWeddings.filter((wedding: any) => {
          console.log('Verificando casamento:', wedding.coupleName, wedding);
          // Verificar se o usuário é criador baseado em diferentes campos possíveis
          const isCreator = wedding.isCreator === true || 
                           wedding.role === 'fiance' || 
                           wedding.userRole === 'fiance' ||
                           wedding.isOwner === true;
          console.log('É criador?', isCreator);
          return isCreator;
        });
        
        const invitations = allWeddings.filter((wedding: any) => {
          console.log('Verificando convite:', wedding.coupleName, wedding);
          // Verificar se o usuário é convidado baseado em diferentes campos possíveis
          const isGuest = wedding.isCreator === false || 
                         wedding.role === 'guest' || 
                         wedding.userRole === 'guest' ||
                         wedding.isOwner === false;
          console.log('É convidado?', isGuest);
          return isGuest;
        });
        
        console.log('Casamentos criados:', createdWeddings);
        console.log('Convites:', invitations);
        
        // Definir meu casamento (primeiro criado)
        if (createdWeddings.length > 0) {
          setMyWedding(createdWeddings[0]);
        } else {
          setMyWedding(null);
        }
        
        // Definir convites
        setMyInvitations(invitations);
        
      } catch (error) {
        console.error('Erro ao buscar casamentos:', error);
        setMyWedding(null);
        setMyInvitations([]);
      } finally {
        setLoadingInvitations(false);
      }
    };

    fetchAllWeddings();
  }, []);

  return (
    <ProtectedRoute>
      {/* Header */}
      <Navbar
        primaryColor="#138263"
        userInitial={user?.name?.[0]?.toUpperCase() || 'B'}
        onAvatarClick={handleAvatarClick}
      />
      <ProfileMenu
        open={open}
        onClose={handleClose}
        user={user}
        logout={logout}
      />

      {/* Conteúdo principal */}
      <Box
        sx={{
          bgcolor: '#F8F8F8',
          minHeight: 'calc(100vh - 66.6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: 2,
          position: 'relative',
          paddingTop: '66.6px',
        }}
      >
        {/* Adorno lateral esquerdo */}
        <Box
          sx={{
            position: 'fixed',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: { xs: 'block', sm: 'block', md: 'block', lg: 'block', xl: 'block' },
            pointerEvents: 'none',
          }}
        >
          <AdornoHome style={{ width: '20px', height: '403px' }} />
        </Box>

        {/* Adorno lateral direito (invertido) */}
        <Box
          sx={{
            position: 'fixed',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%) rotate(180deg)',
            zIndex: 10,
            display: { xs: 'block', sm: 'block', md: 'block', lg: 'block', xl: 'block' },
            pointerEvents: 'none',
          }}
        >
          <AdornoHome style={{ width: '20px', height: '403px' }} />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            p: { xs: 3, md: 5 },
            mb: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 600,
                fontSize: { xs: 28, md: 40 },
                lineHeight: '48px',
                color: '#0B6D51',
                textAlign: 'left',
              }}
            >
              Meu casamento
            </Typography>
            <Box />
          </Box>
          {myWedding ? (
            <Box
              sx={{
                position: 'relative',
                width: 799.2,
                height: 266.4,
                maxWidth: '100%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {myWedding.footerPhoto && (
                <button
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    padding: 0,
                    background: 'none',
                    cursor: 'pointer',
                    borderRadius: '9.99px',
                    overflow: 'hidden',
                  }}
                  onClick={() => router.push("/my-wedding")}
                >
                  <img
                    src={myWedding.footerPhoto}
                    alt="Foto do Casamento"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '9.99px',
                      display: 'block',
                    }}
                  />
                </button>
              )}
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 400,
                  fontSize: { xs: 18, md: 26.64 },
                  lineHeight: '32px',
                  color: '#737373',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                Você ainda não possui casamento para chamar de seu...
              </Typography>
              <CustomButton
                sx={{
                  width: 376,
                  maxWidth: '100%',
                  height: 87,
                  borderRadius: '27.3px',
                  background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                  color: '#0B6D51',
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 300,
                  fontSize: 28,
                  boxShadow: '0px 2.664px 2.664px rgba(0, 0, 0, 0.15)',
                  textTransform: 'none',
                  mt: 1,
                  ':hover': {
                    background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                    opacity: 0.9,
                  },
                }}
                onClick={() => router.push("/criar-casamento")}
              >
                Criar meu casamento
              </CustomButton>
            </>
          )}
        </Box>

        {/* Seção convites */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            p: { xs: 3, md: 5 },
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Linha superior: título e ação */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 600,
                fontSize: { xs: 28, md: 40 },
                lineHeight: '48px',
                color: '#0B6D51',
                textAlign: 'left',
              }}
            >
              Meus convites
            </Typography>
            {user?.role === 'guest' && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6.66px',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={() => {
                  setCode("");
                  setErrorJoin("");
                  setModalOpen(true);
                }}
              >
                {/* Ícone placeholder */}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7.5" cy="7.5" r="7" stroke="#138263" strokeWidth="1.3" />
                  <line x1="7.5" y1="4" x2="7.5" y2="11" stroke="#138263" strokeWidth="1.3" />
                  <line x1="4" y1="7.5" x2="11" y2="7.5" stroke="#138263" strokeWidth="1.3" />
                </svg>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 400,
                    fontSize: '16.65px',
                    lineHeight: '20px',
                    color: '#138263',
                  }}
                >
                  Adicionar Casamento
                </Typography>
              </Box>
            )}
          </Box>
                    {/* Cards dos convites */}
          {loadingInvitations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ color: '#138263' }} />
            </Box>
          ) : myInvitations.length > 0 ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3,
                  mt: 2,
                }}
              >
                {myInvitations.map((wedding, index) => (
                  <Box
                    key={wedding.id || index}
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={() => router.push(`/wedding-guest/code/${wedding.id}`)}
                  >
                    {/* Imagem do casamento */}
                    {wedding.footerPhoto ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={wedding.footerPhoto}
                          alt={`${wedding.coupleName}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          bgcolor: wedding.primaryColor || '#138263',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-figtree)',
                            fontWeight: 600,
                            fontSize: 24,
                            color: '#fff',
                            textAlign: 'center',
                          }}
                        >
                          {wedding.coupleName?.charAt(0) || 'C'}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Informações do casamento */}
                    <Box sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-figtree)',
                          fontWeight: 600,
                          fontSize: 18,
                          color: '#333',
                          mb: 1,
                          textAlign: 'center',
                        }}
                      >
                        {wedding.coupleName}
                      </Typography>
                      
                      {wedding.weddingDate && (
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-figtree)',
                            fontWeight: 400,
                            fontSize: 14,
                            color: '#666',
                            textAlign: 'center',
                            mb: 1,
                          }}
                        >
                          {new Date(wedding.weddingDate).toLocaleDateString('pt-BR')}
                        </Typography>
                      )}
                      
                      {wedding.weddingLocation && (
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-figtree)',
                            fontWeight: 400,
                            fontSize: 14,
                            color: '#666',
                            textAlign: 'center',
                            mb: 2,
                          }}
                        >
                          {wedding.weddingLocation}
                        </Typography>
                      )}
                      
                      <CustomButton
                        sx={{
                          width: '100%',
                          height: 40,
                          borderRadius: '20px',
                          bgcolor: wedding.primaryColor || '#138263',
                          color: '#fff',
                          fontFamily: 'var(--font-figtree)',
                          fontWeight: 500,
                          fontSize: 14,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: wedding.primaryColor ? `${wedding.primaryColor}dd` : '#106b52',
                          },
                        }}
                        onClick={() => {
                          router.push(`/wedding-guest/code/${wedding.id}`);
                        }}
                      >
                        Ver Casamento
                      </CustomButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {/* Botão para adicionar mais casamentos */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <CustomButton
                  sx={{
                    width: 300,
                    maxWidth: '100%',
                    height: 60,
                    borderRadius: '30px',
                    background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                    color: '#0B6D51',
                    fontFamily: 'var(--font-figtree)',
                    fontWeight: 500,
                    fontSize: 18,
                    boxShadow: '0px 2.664px 2.664px rgba(0, 0, 0, 0.15)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => {
                    setCode("");
                    setErrorJoin("");
                    setModalOpen(true);
                  }}
                >
                  Adicionar Mais Casamentos
                </CustomButton>
              </Box>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 400,
                  fontSize: { xs: 18, md: 26.64 },
                  lineHeight: '32px',
                  color: '#737373',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                Você ainda não possui convites...
              </Typography>
              <CustomButton
                sx={{
                  width: 376,
                  maxWidth: '100%',
                  height: 87,
                  borderRadius: '27.3px',
                  background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                  color: '#0B6D51',
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 300,
                  fontSize: 28,
                  boxShadow: '0px 2.664px 2.664px rgba(0, 0, 0, 0.15)',
                  textTransform: 'none',
                  mt: 1,
                  ':hover': {
                    background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                    opacity: 0.9,
                  },
                }}
                onClick={() => {
                  setCode("");
                  setErrorJoin("");
                  setModalOpen(true);
                }}
              >
                Adicionar um casamento
              </CustomButton>
            </>
          )}
        </Box>
        <CustomModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setCode("");
            setErrorJoin("");
          }}
          code={code}
          setCode={setCode}
          onSubmit={handleSubmitCode}
          loading={loadingJoin}
          error={errorJoin}
        />
      </Box>
    </ProtectedRoute>
  );
}