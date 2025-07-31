import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { StaticImageData } from 'next/image';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string | StaticImageData;
  editable?: boolean;
  showDelete?: boolean;
  onNameChange?: (newName: string) => void;
  onPriceChange?: (newPrice: number) => void;
  onImageChange?: (newImage: string) => void;
  onDelete?: () => void;
}

const Product: React.FC<ProductProps> = ({
  name,
  price,
  image,
  editable = false,
  showDelete = false,
  onNameChange,
  onPriceChange,
  onImageChange,
  onDelete,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getImageSrc = (image: string | StaticImageData): string => {
    return typeof image === 'string' ? image : image.src;
  };

  return (
    <Card
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: 250,
        margin: '0 auto',
        transition: '0.2s',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Botão de deletar */}
      {showDelete && onDelete && (
        <IconButton
          onClick={onDelete}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: '#d32f2f',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}

      <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={getImageSrc(image)}
          alt={name}
          sx={{
            width: '100%',
            height: 280,
            objectFit: 'cover',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        {editable && onImageChange && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
              cursor: 'pointer',
              '&:hover': {
                opacity: 1,
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    if (result) {
                      onImageChange(result);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <EditIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
          )}
        </div>
      <CardContent sx={{ p: 2 }}>
        {editable && onNameChange ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <TextField
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  padding: '4px 8px',
                },
              }}
              InputLabelProps={{
                shrink: false,
              }}
            />
            <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
          </div>
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-figtree), sans-serif',
              color: '#333',
              textAlign: 'center',
              overflow: 'hidden',
              fontSize: '1.2rem',
              mb: 1,
              lineHeight: 1.4,
            }}
          >
            {name}
          </Typography>
        )}

        {editable && onPriceChange ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            <TextField
              type="number"
              value={price}
              onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  padding: '4px 8px',
                },
              }}
              InputLabelProps={{
                shrink: false,
              }}
            />
            <EditIcon sx={{ color: '#2563eb', fontSize: 16 }} />
          </div>
        ) : (
          <Typography
            sx={{
              fontFamily: 'var(--font-figtree), sans-serif',
              fontWeight: 700,
              color: 'black',
              textAlign: 'center',
              fontSize: '1rem',
              mb: 2,
            }}
          >
            {formatPrice(price)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Product;