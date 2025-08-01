// src/app/components/FiancePhoto.tsx
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useRef, useState } from 'react';

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e0e0e0',
              textAlign: 'center',
              p: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: size * 0.2, mb: 1 }} />
            <Typography
              sx={{
                fontSize: size * 0.08,
                fontWeight: 400,
                color: '#999',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Clique para adicionar foto
            </Typography>
          </Box>
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