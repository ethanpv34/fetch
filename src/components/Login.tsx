import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, Paper, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
  background-color: #f0eeff;
`;

const StyledPaper = styled(Paper)`
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    max-width: 500px;
    padding: 40px;
  }

  @media (min-width: 1200px) {
    max-width: 550px;
    padding: 48px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({ name: '', email: '' });
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = () => {
    let isValid = true;
    const errors = { name: '', email: '' };
    
    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await login({ name, email });
    
    if (!error) {
      navigate('/search');
    }
  };

  return (
    <LoginContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
          fontSize: isMobile ? '1.75rem' : '2.25rem',
          mb: isMobile ? 2 : 3 
        }}>
          Fetch Your Perfect Dog
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3 }}>
          Please log in to start searching for adoptable dogs
        </Typography>
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors({...formErrors, name: ''});
            }}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
            sx={{ '& .MuiInputBase-input': { fontSize: isMobile ? 'inherit' : '1.1rem' } }}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors({...formErrors, email: ''});
            }}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
            sx={{ '& .MuiInputBase-input': { fontSize: isMobile ? 'inherit' : '1.1rem' } }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ 
              color: 'white',
              mt: 2,
              py: isMobile ? 1.5 : 2,
              fontSize: isMobile ? 'inherit' : '1.1rem'
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Form>
      </StyledPaper>
    </LoginContainer>
  );
};

export default Login; 