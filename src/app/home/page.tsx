"use client";
import AdornoHome from "@/components/AdornoHome/AdornoHome";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomModal from "@/components/CustomModal/CustomModal";
import Navbar from "@/components/Navbar";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthContext } from "@/providers/AuthProvider";
import { weddingService } from "@/services/weddingService";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Wedding {
  id: number;
  coupleName: string;
  primaryColor: string;
  weddingDate: string;
  weddingLocation: string;
  couplePhotos: string[];
  description: string;
  footerPhoto?: string;
  isActive: boolean;
  godparents?: Array<{
    id: number;
    name: string;
    photo?: string;
    relationship: string;
    description: string;
    isActive: boolean;
  }>;
  gifts?: Array<{
    id: number;
    name: string;
    description: string;
    photo: string;
    price: string;
    store: string;
    amountPaid: string;
    amountRemaining: string;
    isFullyPaid: boolean;
    paymentStatus: string;
    isActive: boolean;
  }>;
  invitationCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomeProtected() {
  const { logout, user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loadingJoin, setLoadingJoin] = React.useState(false);
  const [errorJoin, setErrorJoin] = React.useState("");
  const [myWedding, setMyWedding] = useState<Wedding | null>(null);
  const [loadingWedding, setLoadingWedding] = useState(true);
  const [deletingWedding, setDeletingWedding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [weddingToDelete, setWeddingToDelete] = useState<number | null>(null);
  const router = useRouter();
  const handleSubmitCode = async () => {
    setLoadingJoin(true);
    setErrorJoin("");
    try {
      await weddingService.joinWedding(code);
      setModalOpen(false);
      setCode("");
      // Aqui você pode atualizar o estado dos convites/casamentos se necessário
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response && err.response.status === 404) {
        setErrorJoin("Código não existente");
      } else {
        setErrorJoin("Erro ao entrar no casamento");
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

  const handleDeleteWedding = async (e: React.MouseEvent, weddingId: number) => {
    e.stopPropagation(); // Previne que o clique propague para o botão do casamento
    setWeddingToDelete(weddingId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!weddingToDelete) return;
    
    setDeletingWedding(true);
    try {
      await weddingService.deleteWedding(weddingToDelete);
      setMyWedding(null); // Remove o casamento do estado
      setShowDeleteConfirm(false);
      setWeddingToDelete(null);
    } catch (error) {
      // Erro ao excluir casamento
    } finally {
      setDeletingWedding(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setWeddingToDelete(null);
  };

  useEffect(() => {
    const fetchMyWedding = async () => {
      setLoadingWedding(true);
      try {
        const data = await weddingService.getMyWeddings();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Filtrar apenas casamentos ativos (isActive: true)
          const activeWeddings = data.filter((wedding: Wedding) => wedding.isActive === true);
          
          if (activeWeddings.length > 0) {
            setMyWedding(activeWeddings[0]); // Pega o primeiro casamento ativo
          } else {
            setMyWedding(null);
          }
        } else {
          setMyWedding(null);
        }
      } catch (e) {
        // Erro ao buscar casamentos
      } finally {
        setLoadingWedding(false);
      }
    };
    fetchMyWedding();
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
          {loadingWedding ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 266.4,
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-figtree)',
                  fontWeight: 400,
                  fontSize: { xs: 18, md: 26.64 },
                  color: '#737373',
                }}
              >
                Carregando...
              </Typography>
            </Box>
          ) : myWedding ? (
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
              {/* Ícones de ação */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  display: 'flex',
                  gap: 1,
                }}
              >
                {/* Botão de editar */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/editar-casamento/${myWedding.id}`);
                  }}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  title="Editar casamento"
                >
                  <EditIcon />
                </IconButton>

                {/* Botão de exclusão */}
                <IconButton
                  onClick={(e) => handleDeleteWedding(e, myWedding.id)}
                  disabled={deletingWedding}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(0, 0, 0, 0.4)',
                    },
                  }}
                  title="Excluir casamento"
                >
                  {deletingWedding ? (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  ) : (
                    <CloseIcon />
                  )}
                </IconButton>
              </Box>

              {myWedding.footerPhoto ? (
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
              ) : (
                <button
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    padding: 20,
                    background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                    cursor: 'pointer',
                    borderRadius: '9.99px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => router.push("/my-wedding")}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-figtree)',
                      fontWeight: 600,
                      fontSize: { xs: 18, md: 24 },
                      color: '#0B6D51',
                      textAlign: 'center',
                    }}
                  >
                    {myWedding.coupleName || 'Meu Casamento'}
                  </Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6.66px' }}>
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
          {/* Mensagem principal */}
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

        {/* Modal de confirmação de exclusão */}
        <Dialog
          open={showDeleteConfirm}
          onClose={cancelDelete}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '7.992px',
              boxShadow: '6.66px 6.66px 13.32px rgba(0, 0, 0, 0.25)',
              p: { xs: 1, md: 2 },
              bgcolor: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 600,
                fontSize: { xs: 20, md: 24 },
                color: '#2B2B2B',
              }}
            >
              Confirmar exclusão
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-figtree)',
                fontWeight: 400,
                fontSize: { xs: 16, md: 18 },
                color: '#666',
                lineHeight: 1.5,
              }}
            >
              Tem certeza que deseja excluir este casamento? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
            <CustomButton
              onClick={cancelDelete}
              disabled={deletingWedding}
              sx={{
                bgcolor: '#f5f5f5',
                color: '#666',
                '&:hover': { bgcolor: '#e0e0e0' },
                minWidth: 120,
              }}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              onClick={confirmDelete}
              disabled={deletingWedding}
              sx={{
                bgcolor: '#dc3545',
                color: 'white',
                '&:hover': { bgcolor: '#c82333' },
                '&:disabled': { bgcolor: '#dc3545', opacity: 0.6 },
                minWidth: 120,
              }}
            >
              {deletingWedding ? 'Excluindo...' : 'Excluir'}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}