// src/components/auth/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Email,
  LocalHospital,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later');
          break;
        default:
          setError('Failed to send reset email. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          textAlign: 'center'
        }}
      >
        <CheckCircle 
          sx={{ 
            fontSize: 64, 
            color: 'success.main', 
            mb: 2 
          }} 
        />
        
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}
        >
          Check Your Email
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          We've sent a password reset link to{' '}
          <strong>{email}</strong>
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Please check your email and follow the instructions to reset your password.
        </Typography>

        <Button
          component={Link}
          to="/auth/login"
          variant="contained"
          startIcon={<ArrowBack />}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          }}
        >
          Back to Sign In
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LocalHospital 
          sx={{ 
            fontSize: 48, 
            color: 'primary.main', 
            mb: 1 
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 1
          }}
        >
          Reset Password
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}
        >
          Enter your email address and we'll send you a link to reset your password
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          disabled={loading}
          placeholder="Enter your registered email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
            },
            '&:disabled': {
              background: '#e0e0e0',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Reset Link'
          )}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link 
            to="/auth/login"
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            Back to Sign In
          </Link>
        </Box>
      </form>
    </Paper>
  );
};

export default ForgotPassword;