// src/app/components/FiancePhoto.tsx
import Box from '@mui/material/Box';

const FianceBanner = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box
        sx={{
          width: 800,
          height: 266,
          bgcolor: '#D9D9D9',
          borderRadius: 2,
          display: 'block',
          margin: '0 auto 16px auto',
        }}
      />
    </Box>
  );
};

export default FianceBanner;