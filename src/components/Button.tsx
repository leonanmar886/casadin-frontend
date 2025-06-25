// Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import './Button.css'; // Importa o CSS do botão

// 1. Definindo as Props para o nosso componente Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <button
      className={`button-component ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest} 
    >
      {text}
    </button>
  );
};

export default Button;