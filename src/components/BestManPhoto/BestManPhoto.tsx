// src/app/components/BestManPhoto.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

interface BestManPhotoProps {
  text: string;
}

const BestManPhoto: React.FC<BestManPhotoProps> = ({ text }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box
        sx={{
          width: 125,
          height: 125,
          bgcolor: '#D9D9D9',
          borderRadius: '50%',
          display: 'block',
          margin: '0 auto 16px auto',
        }}
      />
      <Typography sx={{ fontSize: 25 }}> {text} </Typography>
    </Box>
  );
};

export default BestManPhoto;