"use client";
import casadinLogo from "@/assets/casadin-logo.svg";
import AdornoHome from "@/components/AdornoHome/AdornoHome";
import CustomButton from "@/components/CustomButton/CustomButton";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthContext } from "@/providers/AuthProvider";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import CustomModal from "@/components/CustomModal/CustomModal";
import { weddingService } from "@/services/weddingService";

export default function HomeProtected() {
  const { logout, user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loadingJoin, setLoadingJoin] = React.useState(false);
  const [errorJoin, setErrorJoin] = React.useState("");
  const handleSubmitCode = async () => {
    setLoadingJoin(true);
    setErrorJoin("");
    try {
      await weddingService.joinWedding(code);
      setModalOpen(false);
      setCode("");
      // Aqui você pode atualizar o estado dos convites/casamentos se necessário
    } catch (err: any) {
      if (err?.response?.status === 404) {
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

  return (
    <ProtectedRoute>
      {/* Header */}
      <Box sx={{
        width: '100%',
        height: 66.6,
        bgcolor: '#138263',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image src={casadinLogo} alt="CASADIN logo" height={40} style={{ width: 'auto' }} />
        </Box>
        <Avatar
          sx={{ bgcolor: '#D9D9D9', width: 47, height: 47, fontSize: 26, color: '#000', fontFamily: 'Figtree', fontWeight: 400, cursor: 'pointer' }}
          onClick={handleAvatarClick}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <ProfileMenu
          open={open}
          onClose={handleClose}
          user={user}
          logout={logout}
        />
      </Box>

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
                fontFamily: 'Figtree',
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
          {/* Mensagem principal */}
          <Typography
            sx={{
              fontFamily: 'Figtree',
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
          {/* Botão Criar casamento */}
          <CustomButton
            sx={{
              width: 376,
              maxWidth: '100%',
              height: 87,
              borderRadius: '27.3px',
              background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
              color: '#0B6D51',
              fontFamily: 'Figtree',
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
          >
            Criar meu casamento
          </CustomButton>
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
                fontFamily: 'Figtree',
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
                    fontFamily: 'Figtree',
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
              fontFamily: 'Figtree',
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
              fontFamily: 'Figtree',
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
      </Box>
    </ProtectedRoute>
  );
} 