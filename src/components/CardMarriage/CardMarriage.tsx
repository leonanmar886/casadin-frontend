// src/app/components/CardMarriage.tsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import React from 'react';

interface CardMarriageProps {
  text: string;
}

const CardMarriage: React.FC<CardMarriageProps> = ({ text }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Card
        sx={{
          width: 250,
          height: 250,
          bgcolor: '#D9D9D9',
          borderRadius: 2,
          boxShadow: 'inset 0 -16px 24px -8px rgba(0,0,0,0.18)',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 10,
            transform: 'translateX(-50%)',
            fontSize: '1.2rem',
            color: '#333',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          {text}
        </Typography>
      </Card>
    </Box>
  );
};

export default CardMarriage;