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

export default function HomeProtected() {
  const { logout, user } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
          {/* Título principal */}
          <Typography
            sx={{
              fontFamily: 'Figtree',
              fontWeight: 600,
              fontSize: { xs: 28, md: 40 },
              lineHeight: '48px',
              color: '#0B6D51',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Meu casamento
          </Typography>
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
          <Typography
            sx={{
              fontFamily: 'Figtree',
              fontWeight: 600,
              fontSize: { xs: 28, md: 40 },
              lineHeight: '48px',
              color: '#0B6D51',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Meus convites
          </Typography>
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
          >
            Adicionar um casamento
          </CustomButton>
        </Box>
      </Box>
    </ProtectedRoute>
  );
} 