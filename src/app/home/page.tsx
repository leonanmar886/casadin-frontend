"use client";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthContext } from "@/providers/AuthProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import casadinLogo from "@/assets/casadin-logo.svg";
import React from "react";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import xClose from "@/assets/x-close.svg";
import logoutIcon from "@/assets/logout-icon.svg";
import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";

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
          anchorEl={anchorEl}
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
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            p: { xs: 3, md: 5 },
            mb: 1,
            display: 'flex',
            flexDirection: 'column',
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
              textAlign: 'left',
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
              textAlign: 'left',
              mb: 4,
            }}
          >
            Você ainda não possui casamento para chamar de seu...
          </Typography>
          {/* Botão Criar casamento */}
          <Button
            variant="contained"
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
              alignSelf: 'center',
              mt: 1,
              ':hover': {
                background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                opacity: 0.9,
              },
            }}
          >
            Criar meu casamento
          </Button>
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
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Figtree',
              fontWeight: 600,
              fontSize: { xs: 28, md: 40 },
              lineHeight: '48px',
              color: '#0B6D51',
              textAlign: 'left',
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
              textAlign: 'left',
              mb: 4,
            }}
          >
            Você ainda não possui convites...
          </Typography>
          <Button
            variant="contained"
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
              alignSelf: 'center',
              mt: 1,
              ':hover': {
                background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
                opacity: 0.9,
              },
            }}
          >
            Adicionar um casamento
          </Button>
        </Box>
      </Box>
    </ProtectedRoute>
  );
} 