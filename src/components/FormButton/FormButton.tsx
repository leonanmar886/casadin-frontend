import './Index.css'
import React from 'react';

interface FormButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ children, onClick }) => {
    return (
        <button className='form-button' onClick={onClick}>
            {children}
        </button>
    );
}

export default FormButton;