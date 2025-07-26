import React from 'react';
import Box from '@mui/material/Box';

interface ColorPaletteProps {
  colors?: string[];
  weddingCode?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onColorSelect?: (color: string) => void;
  primaryColor?: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  colors = ['#E6E6FA', '#F5E6E8', '#B8E0D2', '#F9F7C9', '#F7D9C4'],
  weddingCode = 'Ak3t56',
  position = 'top-right',
  onColorSelect,
  primaryColor = '#138263'
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { position: 'absolute' as const, left: 32, top: 32, textAlign: 'left' as const };
      case 'bottom-right':
        return { position: 'absolute' as const, right: 32, bottom: 32, textAlign: 'right' as const };
      case 'bottom-left':
        return { position: 'absolute' as const, left: 32, bottom: 32, textAlign: 'left' as const };
      default: // top-right
        return { position: 'absolute' as const, right: 32, top: 32, textAlign: 'right' as const };
    }
  };

  const handleColorClick = (color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <Box sx={getPositionStyles()}>
      <Box sx={{ fontSize: 14, color: '#333', fontWeight: 500, marginBottom: 8 }}>
        Paleta de cores
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: color,
              display: 'inline-block',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.2)',
              }
            }}
            title={`Cor ${index + 1}: ${color}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </Box>
      <Box sx={{ fontSize: 14, color: '#888', marginTop: 12 }}>
        O código do seu casamento é:
      </Box>
      <Box sx={{ 
        background: '#E6F4EA', 
        color: primaryColor, 
        borderRadius: 8, 
        padding: '2px 12px', 
        fontWeight: 600, 
        display: 'inline-block', 
        marginTop: 4,
        fontSize: 14
      }}>
        {weddingCode}
      </Box>
    </Box>
  );
};

export default ColorPalette; 