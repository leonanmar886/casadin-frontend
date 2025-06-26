// Button.tsx
import ButtonMui from '@mui/material/Button';
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'contained',
  color = 'primary',
}) => {
  return (
    <ButtonMui
      variant={variant}
      color={color}
      onClick={onClick}
      type={type}
      className={className}
      disabled={disabled}
    >
      {text}
    </ButtonMui>
  );
};

export default Button;