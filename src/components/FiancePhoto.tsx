// src/app/components/FiancePhoto.tsx
import React from 'react';
import './FiancePhoto.css'; // O arquivo CSS para estilização

interface FiancePhotoProps {
  text: string;
}

const FiancePhoto: React.FC<FiancePhotoProps> = ({
  text
}) => {

  return (
    <div className="fiance-photo-container">
      <div className="circle"></div>
      <span style={{ fontSize: 25 }}> {text} </span>
    </div>
  );
};

export default FiancePhoto;