"use client";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthContext } from "@/providers/AuthProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function HomeProtected() {
  const { logout, user } = useAuthContext();
  console.log(user);
  return (
    <ProtectedRoute>
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo à área protegida! 🎉
        </Typography>
        {user && (
          <Typography variant="h6" sx={{ mb: 4 }}>
            Olá, {user.name}!
          </Typography>
        )}
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
    </ProtectedRoute>
  );
} 