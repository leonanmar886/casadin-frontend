"use client";
import { Product } from "@/components/Product";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

interface Gift {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  store?: string;
}

interface GiftManagerProps {
  gifts: Gift[];
  onGiftsChange: (gifts: Gift[]) => void;
  primaryColor?: string;
}

export default function GiftManager({ gifts, onGiftsChange, primaryColor = "#138263" }: GiftManagerProps) {
  // Verificar duplicações nos presentes
  useEffect(() => {
    const uniqueGifts = gifts.filter((gift, index, self) => 
      index === self.findIndex(g => g.id === gift.id)
    );
    
    if (uniqueGifts.length !== gifts.length) {
      onGiftsChange(uniqueGifts);
    }
  }, [gifts, onGiftsChange]);

  const handleGiftNameChange = (id: number, newName: string) => {
    const updatedGifts = gifts.map(gift =>
      gift.id === id ? { ...gift, name: newName } : gift
    );
    onGiftsChange(updatedGifts);
  };

  const handleGiftPriceChange = (id: number, newPrice: number) => {
    const updatedGifts = gifts.map(gift =>
      gift.id === id ? { ...gift, price: newPrice } : gift
    );
    onGiftsChange(updatedGifts);
  };

  const handleGiftImageChange = async (id: number, newImage: string) => {
    try {
      // Por enquanto, apenas armazenar a imagem localmente
      // O upload será feito quando o casamento for salvo
      const updatedGifts = gifts.map(gift =>
        gift.id === id ? { ...gift, image: newImage } : gift
      );
      onGiftsChange(updatedGifts);
    } catch (error) {
      // Em caso de erro, manter a imagem original
      const updatedGifts = gifts.map(gift =>
        gift.id === id ? { ...gift, image: newImage } : gift
      );
      onGiftsChange(updatedGifts);
    }
  };

  const handleGiftDelete = (id: number) => {
    const updatedGifts = gifts.filter(gift => gift.id !== id);
    onGiftsChange(updatedGifts);
  };

  const addGift = () => {
    // Gerar ID único baseado no timestamp + índice para evitar duplicações
    const timestamp = Date.now();
    const newId = gifts.length > 0 ? Math.max(...gifts.map(g => g.id), timestamp) + 1 : timestamp;
    
    // Verificar se já existe um presente com o mesmo nome para evitar duplicações
    const existingGift = gifts.find(g => g.name === 'Novo Presente');
    
    const newGift: Gift = {
      id: newId,
      name: existingGift ? `Novo Presente ${gifts.length + 1}` : 'Novo Presente',
      price: 0,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };
    onGiftsChange([...gifts, newGift]);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        justifyContent: 'center',
        mb: 2,
        maxWidth: 1200,
        mx: 'auto',
      }}>
        {gifts.map((gift) => (
          <Box key={gift.id} sx={{ m: 1 }}>
            <Product
              id={gift.id}
              name={gift.name}
              description={gift.description || gift.name}
              price={gift.price}
              image={gift.image}
              primaryColor={primaryColor}
              editable={true}
              showDelete={true}
              onNameChange={(newName) => handleGiftNameChange(gift.id, newName)}
              onPriceChange={(newPrice) => handleGiftPriceChange(gift.id, newPrice)}
              onImageChange={(newImage) => handleGiftImageChange(gift.id, newImage)}
              onDelete={() => handleGiftDelete(gift.id)}
            />
          </Box>
        ))}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          m: 1 
        }}>
          <Box
            sx={{
              width: 250,
              height: 280,
              borderRadius: 2,
              background: '#E6F4EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: primaryColor,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#D4E8D4',
                transform: 'scale(1.02)'
              }
            }}
            onClick={addGift}
          >
            +
          </Box>
          <Typography sx={{ mt: 1, color: '#555', fontSize: 14 }}>
            Adicionar presente
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 