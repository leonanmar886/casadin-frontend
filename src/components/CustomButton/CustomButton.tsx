import adornoBotao from "@/assets/adorno-botao.svg";
import flores from "@/assets/flores.svg";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
}

export default function CustomButton({ 
  children, 
  onClick, 
  sx, 
  variant = "contained",
  disabled = false 
}: CustomButtonProps) {
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Button
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1,
          ...sx,
        }}
      >
        {/* Flores antes do texto */}
        <Image src={flores} alt="Flores" width={24} height={24} />
        {children}
        
        {/* Adorno inferior esquerdo */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <Image src={adornoBotao} alt="Adorno" width={30} height={30} />
        </Box>
        
        {/* Adorno superior direito (invertido) */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            transform: "rotate(180deg)",
          }}
        >
          <Image src={adornoBotao} alt="Adorno" width={30} height={30} />
        </Box>
      </Button>
    </Box>
  );
} 