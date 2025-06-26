// src/components/auth/EmailVerification/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Email,
  LocalHospital,
  Refresh,
  CheckCircle,
  Home
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { currentUser, resendVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already verified
    if (currentUser?.emailVerified) {
      setIsVerified(true);
    }

    // Check verification status periodically
    const interval = setInterval(async () => {
      if (currentUser && !currentUser.emailVerified) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setIsVerified(true);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resendVerification();
      setSuccess(true);
    } catch (error) {
      console.error('Resend verification error:', error);
      
      switch (error.code) {
        case 'auth/too-many-requests':
          setError('Too many requests. Please wait before requesting another email');
          break;
        case 'auth/user-not-found':
          setError('User not found. Please try signing up again');
          break;
        default:
          setError('Failed to send verification email. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (isVerified) {
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
          Email Verified!
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          Your email has been successfully verified. You can now access all features of EKAH Health.
        </Typography>

        <Button
          onClick={handleContinue}
          variant="contained"
          startIcon={<Home />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            }
          }}
        >
          Continue to Dashboard
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
          Verify Your Email
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Email Icon */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Email 
          sx={{ 
            fontSize: 64, 
            color: 'primary.main',
            mb: 2 
          }} 
        />
        
        <Typography 
          variant="body1" 
          color="text.primary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          We've sent a verification email to:
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 2,
            wordBreak: 'break-word'
          }}
        >
          {currentUser?.email}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          Please check your email and click the verification link to activate your account.
        </Typography>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
          }}
        >
          Verification email sent successfully!
        </Alert>
      )}

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

      {/* Resend Button */}
      <Button
        fullWidth
        variant="outlined"
        onClick={handleResendEmail}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
        sx={{
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.50',
          },
          '&:disabled': {
            borderColor: '#e0e0e0',
            color: '#9e9e9e'
          },
        }}
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      {/* Additional Actions */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Already verified?{' '}
          <Button
            variant="text"
            onClick={() => window.location.reload()}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              p: 0,
              minWidth: 'auto'
            }}
          >
            Refresh Page
          </Button>
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Wrong email?{' '}
          <Link 
            to="/auth/login"
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 600
            }}
          >
            Sign In Again
          </Link>
        </Typography>
      </Box>

      {/* Tips */}
      <Box 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}
        >
          <strong>Tip:</strong> Check your spam/junk folder if you don't see the email. 
          The verification link will expire in 24 hours.
        </Typography>
      </Box>
    </Paper>
  );
};

export default EmailVerification;