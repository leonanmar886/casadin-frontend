"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import loginBanner from "../../assets/login-banner.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      router.replace("/home");
    } catch {
      setError("E-mail ou senha inválidos");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        maxHeight: "100vh",
        background: "#D7D7D7",
        margin: "0 auto",
        overflow: "hidden",
        boxShadow: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "stretch",
      }}
    >
      {/* Imagem lateral */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          width: { md: "55%" },
          minWidth: 320,
          height: "100%",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <Image
          src={loginBanner}
          alt="Imagem lateral"
          fill
          style={{ objectFit: "cover", objectPosition: "center 10%" }}
        />
        {/* Gradiente superior */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: 127,
            left: 0,
            top: 0,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 45.94%, rgba(102, 102, 102, 0) 100%)",
          }}
        />
        {/* Bem-vindo(a) ao Casadin! */}
        <Typography
          sx={{
            position: "absolute",
            left: "50%",
            top: 28,
            transform: "translateX(-50%)",
            fontFamily: "Figtree, sans-serif",
            fontWeight: 600,
            fontSize: "26.64px",
            lineHeight: "32px",
            color: "#FFF",
            width: "100%",
            textAlign: "center",
          }}
        >
          Bem-vindo(a) ao Casadin!
        </Typography>
      </Box>
      {/* Área do formulário */}
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", md: "45%" },
          minWidth: 320,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: { md: "-4px 4px 2px rgba(0,0,0,0.15)", xs: 0 },
          position: "relative",
          zIndex: 2,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 370,
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            alignItems: "center",
            px: 2,
            py: 4,
            margin: "0 auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontWeight: 700,
              fontSize: "29.97px",
              lineHeight: "36px",
              color: "#138263",
              textAlign: "center",
              mb: 2,
            }}
          >
            Faça seu log-in:
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Figtree, sans-serif",
                    fontWeight: 400,
                    fontSize: "19.98px",
                    color: "#000",
                    mb: 1,
                  }}
                >
                  E-mail
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="medium"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  sx={{
                    borderRadius: "7.992px",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "7.992px",
                    },
                    '& fieldset': {
                      borderColor: "#138263",
                      borderWidth: "1.2px",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Figtree, sans-serif",
                    fontWeight: 400,
                    fontSize: "19.98px",
                    color: "#000",
                    mb: 1,
                  }}
                >
                  Senha
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  size="medium"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  sx={{
                    borderRadius: "7.992px",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "7.992px",
                    },
                    '& fieldset': {
                      borderColor: "#138263",
                      borderWidth: "1.2px",
                    },
                  }}
                />
              </Box>
              {error && (
                <Typography color="error" sx={{ textAlign: "center" }}>{error}</Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  height: 56,
                  background: "#138263",
                  borderRadius: "7.992px",
                  fontFamily: "Figtree, sans-serif",
                  fontWeight: 700,
                  fontSize: "19.98px",
                  boxShadow: "0px 3.2px 3.2px rgba(0,0,0,0.25)",
                  textTransform: "none",
                  ':hover': { background: "#106b52" },
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </form>
          <Typography
            sx={{
              fontFamily: "Figtree, sans-serif",
              fontWeight: 400,
              fontSize: "20px",
              color: "#000",
              textAlign: "center",
              mt: 2,
            }}
          >
            Não tem uma conta?{' '}
            <Link href="/register" style={{ color: "#138263", textDecoration: "underline" }}>
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 