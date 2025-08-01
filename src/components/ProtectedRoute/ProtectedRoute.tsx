"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#F8F8F8',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 400,
            fontSize: 18,
            color: '#737373',
          }}
        >
          Carregando...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
} 