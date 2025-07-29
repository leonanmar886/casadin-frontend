import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';

interface ColorPaletteProps {
  colors?: string[];
  weddingCode?: string;
  onColorSelect?: (color: string) => void;
  primaryColor?: string;
}

const DEFAULT_COLORS = [
  '#FFB469', // Ellipse 1
  '#6CA370', // Ellipse 2
  '#EE5D99', // Ellipse 3
  '#78B6F0', // Ellipse 4
  '#A396DB', // Ellipse 5
  '#F6F688', // Ellipse 6
];

const ELLIPSE_LAYOUT = [
  { left: 60, top: 99.24 },  // Ellipse 1
  { left: 110, top: 99.24 },  // Ellipse 2
  { left: 60, top: 23.98 },  // Ellipse 3
  { left: 110, top: 23.98 },  // Ellipse 4
  { left: 60, top: 174.5 },  // Ellipse 5
  { left: 110, top: 174.5 },  // Ellipse 6
];

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors = DEFAULT_COLORS,
  onColorSelect,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [customColor, setCustomColor] = useState<string>(DEFAULT_COLORS[5]);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorClick = (color: string, idx: number) => {
    setSelectedIdx(idx);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  const handleCustomColorClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedIdx(5);
    if (onColorSelect) {
      onColorSelect(e.target.value);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        width: 123.88,
        height: 279.05,
        right: 100,
        top: 150,
        pointerEvents: 'none', // disables drag, only ellipses are clickable
      }}
    >
      {/* Title */}
      <Box
        sx={{
          position: 'absolute',
          width: 121.88,
          height: 56,
          top: -50,
          right: -35,
          fontFamily: 'Figtree, sans-serif',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 23.31,
          lineHeight: '28px',
          textAlign: 'center',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        Paleta de cores
      </Box>
      {/* Rotated Frame */}
      <Box
        sx={{
          position: 'absolute',
          width: 221.11,
          height: 123.88,
          top: 57.94,
          background: '#FFF',
          boxShadow: '-2.664px -3.33px 2.664px rgba(0, 0, 0, 0.25)',
          borderRadius: 9.99,
          transform: 'rotate(-90deg)',
          zIndex: 1,
        }}
      />
      {/* Color Circles */}
      {colors.slice(0, 5).map((color, idx) => (
        <Box
          key={idx}
          sx={{
            position: 'absolute',
            width: 41.29,
            height: 41.29,
            left: ELLIPSE_LAYOUT[idx].left,
            top: ELLIPSE_LAYOUT[idx].top,
            background: color,
            borderRadius: '50%',
            transform: 'rotate(-90deg)',
            zIndex: 2,
            cursor: 'pointer',
            border: selectedIdx === idx ? '3px solid #536565' : '2px solid #fff',
            boxSizing: 'border-box',
            transition: 'transform 0.2s, border 0.2s',
            pointerEvents: 'auto',
            '&:hover': {
              transform: 'rotate(-90deg) scale(1.1)',
            },
          }}
          title={`Cor ${idx + 1}: ${color}`}
          onClick={() => handleColorClick(color, idx)}
        />
      ))}
      {/* Elipse 6: Color Picker */}
      <Box
        sx={{
          position: 'absolute',
          width: 41.29,
          height: 41.29,
          left: ELLIPSE_LAYOUT[5].left,
          top: ELLIPSE_LAYOUT[5].top,
          background: selectedIdx === 5
            ? customColor
            : 'conic-gradient(#6a6aff, #6aff6a, #ff6a6a, #6a6aff)',
          borderRadius: '50%',
          transform: 'rotate(-90deg)',
          zIndex: 2,
          cursor: 'pointer',
          border: selectedIdx === 5 ? '3px solid #536565' : '2px solid #fff',
          boxSizing: 'border-box',
          transition: 'transform 0.2s, border 0.2s',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            transform: 'rotate(-90deg) scale(1.1)',
          },
        }}
        title={selectedIdx === 5 ? `Cor personalizada: ${customColor}` : 'Escolha uma cor'}
        onClick={handleCustomColorClick}
      >
        <input
          type="color"
          ref={colorInputRef}
          value={customColor}
          onChange={handleCustomColorChange}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            border: 'none',
            padding: 0,
          }}
          tabIndex={-1}
        />
      </Box>
    </Box>
  );
};

export default ColorPalette; 