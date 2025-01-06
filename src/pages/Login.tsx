import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await authService.login({ email, password });
      login(userData);
      navigate('/chat');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleLogin}
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <MuiLink component={Link} to="/register">
            Don't have an account? Register
          </MuiLink>
        </Box>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <MuiLink component={Link} to="/forgot-password">
            Forgot password?
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
} 