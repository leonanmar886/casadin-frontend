// src/app/components/Form.tsx
import React from 'react';
import './Form.css'; // O arquivo CSS para estilização

interface FormProps {
  text: string;
}

const Form: React.FC<FormProps> = ({
  text
}) => {

  return (
    <div>
      <h3> {text} </h3>
      <input></input>
    </div>
  );
};

export default Form;