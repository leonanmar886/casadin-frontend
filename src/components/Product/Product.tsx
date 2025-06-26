import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { StaticImageData } from 'next/image';
import React from 'react';

interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string | StaticImageData;
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  price,
  image,
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
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
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
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Figtree, sans-serif',
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
        <Typography
          sx={{
            fontFamily: 'Figtree, sans-serif',
            fontWeight: 700,
            color: 'black',
            textAlign: 'center',
            fontSize: '1rem',
            mb: 2,
          }}
        >
          {formatPrice(price)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;