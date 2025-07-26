// src/app/components/FiancePhoto.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import React, { useRef, useState } from 'react';

interface FiancePhotoProps {
  text: string;
  onPhotoChange?: (photoUrl: string) => void;
  size?: number;
}

const FiancePhoto: React.FC<FiancePhotoProps> = ({ 
  text, 
  onPhotoChange,
  size = 250 
}) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const photoUrl = URL.createObjectURL(e.target.files[0]);
      setPhoto(photoUrl);
      if (onPhotoChange) {
        onPhotoChange(photoUrl);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box
        sx={{
          width: size,
          height: size,
          bgcolor: '#A9A9A9',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={handleClick}
        title="Clique para alterar a foto"
      >
        {photo ? (
          <img
            src={photo}
            alt={`Foto de ${text}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PersonIcon sx={{ color: '#e0e0e0', fontSize: size * 0.3 }} />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </Box>
      <Typography sx={{ fontSize: 25, fontWeight: 500 }}> {text} </Typography>
    </Box>
  );
};

export default FiancePhoto;