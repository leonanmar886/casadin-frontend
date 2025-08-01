// src/app/components/BestManPhoto.tsx
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';

interface BestManPhotoProps {
  text: string;
  onPhotoChange?: (photoUrl: string) => void;
  onNameChange?: (newName: string) => void;
  onDelete?: () => void;
  size?: number;
  editable?: boolean;
  showDelete?: boolean;
  initialPhoto?: string | null; // Adicionado para uso em modo não-editável
  index?: number; // Adicionado para key única
}

const BestManPhoto: React.FC<BestManPhotoProps> = ({
  text,
  onPhotoChange,
  onNameChange,
  onDelete,
  size = 200,
  editable = true,
  showDelete = false,
  initialPhoto = null,
  index = 0,
}) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [name, setName] = useState(text);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar o estado interno com as props
  useEffect(() => {
    setPhoto(initialPhoto);
  }, [initialPhoto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const photoUrl = URL.createObjectURL(e.target.files[0]);
      setPhoto(photoUrl);
      if (onPhotoChange) {
        onPhotoChange(photoUrl);
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (onNameChange) {
      onNameChange(newName);
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
          width: 200,
          height: 200,
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
        title={editable ? "Clique para alterar a foto" : ""}
      >
        {photo ? (
          <img
            src={photo}
            alt={`Foto de ${name}`}
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
              p: 1,
            }}
          >
            <PersonIcon sx={{ fontSize: 32, mb: 0.5 }} />
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                color: '#999',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Adicionar foto
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
      {editable ? (
        // Modo editável: input + ícone de edição + ícone de remoção
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            key={`name-input-${index}`}
            style={{
              fontWeight: 500,
              fontSize: 16,
              textAlign: 'center',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: name.length > 0 ? name.length * 10 : 60,
              minWidth: 60,
              maxWidth: 120
            }}
          />
          <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
          {showDelete && onDelete && (
            <DeleteIcon
              sx={{
                color: '#dc3545',
                fontSize: 18,
                cursor: 'pointer',
                '&:hover': {
                  color: '#c82333'
                }
              }}
              onClick={onDelete}
            />
          )}
        </Box>
      ) : (
        // Modo não-editável: apenas texto
        <Box sx={{
          fontWeight: 500,
          fontSize: 16,
          textAlign: 'center',
          color: '#333'
        }}>
          {name}
        </Box>
      )}
    </Box>
  );
};
export default BestManPhoto;