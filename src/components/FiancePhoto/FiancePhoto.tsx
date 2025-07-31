// src/app/components/FiancePhoto.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import React, { useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

interface FiancePhotoProps {
  text: string;
  onPhotoChange?: (photoUrl: string) => void;
  size?: number;
  editable?: boolean;
  initialPhoto?: string | null; // Adicionada prop para foto inicial
}

const FiancePhoto: React.FC<FiancePhotoProps> = ({
  text,
  onPhotoChange,
  size = 250,
  editable = true,
  initialPhoto = null // Novo parâmetro
}) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto); // Usa initialPhoto como valor inicial
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
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
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
          cursor: editable ? 'pointer' : 'default',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={handleClick}
        title={editable ? 'Clique para alterar a foto' : ''}
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
        {editable && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </>
        )}
      </Box>
      {editable && (
        <Box
          sx={{
            position: 'absolute',
            top: -16,
            right: -16,
            bgcolor: 'white',
            borderRadius: '50%',
            boxShadow: 1,
            p: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          title="Editar foto"
        >
          <EditIcon sx={{ color: '#2563eb', fontSize: 22 }} />
        </Box>
      )}
      <Typography sx={{ fontSize: 25, fontWeight: 500 }}> {text} </Typography>
    </Box>
  );
};

export default FiancePhoto;