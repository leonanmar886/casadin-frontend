// src/app/components/BestManPhoto.tsx
import React from 'react';
import './BestManPhoto.css'; // O arquivo CSS para estilização

interface BestManPhotoProps {
  text: string;
}

const BestManPhoto: React.FC<BestManPhotoProps> = ({
  text
}) => {

  return (
    <div className="bestman-photo-container">
      <div className="circle"></div>
      <span style={{ fontSize: 25 }}> {text} </span>
    </div>
  );
};

export default BestManPhoto;