import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface EditablePhotoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  onPhotoChange?: (photoUrl: string) => void;
  editable?: boolean;
}

const EditablePhoto: React.FC<EditablePhotoProps> = ({
  src,
  alt,
  width,
  height,
  style = {},
  onPhotoChange,
  editable = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoChange) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        cursor: editable ? 'pointer' : 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {src && src !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            borderRadius: style.borderRadius || 16,
            objectFit: style.objectFit || 'cover',
            ...style
          }}
        />
      ) : (
        <Box
          sx={{
            width: width,
            height: height,
            borderRadius: style.borderRadius || 16,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ccc',
            color: '#666',
            textAlign: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              fontSize: width * 0.15,
              mb: 1,
              color: '#999',
            }}
          >
            📷
          </Box>
          <Box
            sx={{
              fontSize: width * 0.04,
              fontWeight: 500,
              color: '#666',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Clique para adicionar foto
          </Box>
        </Box>
      )}
      
      {editable && isHovered && (
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
            borderRadius: style.borderRadius || 16,
          }}
        >
          <IconButton
            onClick={handleEditClick}
            sx={{
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default EditablePhoto; 