import React from 'react';
import './Product.css';
import { StaticImageData } from 'next/image';

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
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={getImageSrc(image)} 
          alt={name}
          className="product-image"
          loading="lazy"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-price">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
};

export default Product;