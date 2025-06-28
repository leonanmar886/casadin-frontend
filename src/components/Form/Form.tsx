'use client'
import React from 'react';
import FormInput from '../FormInput';
import FormButton from '../FormButton/FormButton';
import './Index.css'

const Form = () => {
    return (
        <div className="form-container">
            <div className="image-container">
                <img src="Couple.png" alt="Casal feliz" />
            </div>
            <div className='form'>
                <h1 className='form-title'>
                    Faça seu cadastro:
                </h1>
                <FormInput text='Nome completo'></FormInput>
                <FormInput text='Email'></FormInput>
                <FormInput text='Senha'></FormInput>
                <FormButton>
                    Cadastrar
                </FormButton>
            </div >
        </div>
    );
};

export default Form;