// src/app/components/CardMarriage.tsx
import React from 'react';
import './CardMarriage.css'; // O arquivo CSS para estilização

interface CardMarriageProps {
  text: string;
}

const CardMarriage: React.FC<CardMarriageProps> = ({
  text
}) => {

  return (
    <div className="card-marriage-container">
      <div className="square">
        <span className='square-text'>{text}</span>
      </div>
    </div>
  );
};

export default CardMarriage;