// src/app/components/Form.tsx
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';

interface FormProps {
  text: string;
}

const Form: React.FC<FormProps> = ({ text }) => {
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>{text}</Typography>
      <TextField
        variant="outlined"
        fullWidth
        sx={{
          width: 370,
          height: 45,
          borderRadius: 2,
          mb: 2,
        }}
        InputProps={{
          sx: {
            borderRadius: 2,
            height: 45,
          },
        }}
      />
    </div>
  );
};

export default Form;