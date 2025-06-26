// src/components/auth/RegisterForm/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  LocalHospital,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

const steps = ['Basic Info', 'Account Details', 'Personal Details'];

const RegisterForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client', // Fixed to client only
    dateOfBirth: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(''); // Clear error when going back
  };

  const validateStep = (step) => {
    setError('');
    
    switch (step) {
      case 0: // Basic Info
        if (!formData.firstName.trim()) {
          setError('Please enter your first name');
          return false;
        }
        if (!formData.lastName.trim()) {
          setError('Please enter your last name');
          return false;
        }
        if (!formData.phone.trim()) {
          setError('Please enter your phone number');
          return false;
        }
        // Basic phone validation
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (!phoneRegex.test(formData.phone.trim())) {
          setError('Please enter a valid phone number');
          return false;
        }
        return true;
        
      case 1: // Account Details
        if (!formData.email.trim()) {
          setError('Please enter your email address');
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.password) {
          setError('Please enter a password');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (!formData.confirmPassword) {
          setError('Please confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
        
      case 2: // Personal Details - optional step, always valid
        return true;
        
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: 'client', // Always client
        dateOfBirth: formData.dateOfBirth || '',
        address: formData.address.trim() || ''
      };

      await register(formData.email.trim(), formData.password, userData);
      
      navigate('/auth/email-verification');
    } catch (error) {
      console.error('Registration error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection');
          break;
        default:
          setError('Registration failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Enter first name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Enter last name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Enter phone number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Enter email address"
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
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Create password (min 6 characters)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                required
                placeholder="Confirm your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={loading}
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Account Type:</strong> Client Account
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  You're signing up as a client to access wellness services and consultations.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth (Optional)"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address (Optional)"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                placeholder="Enter your address"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 500,
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
          Join EKAH Health
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: '0.9rem' }}
        >
          Start your wellness journey today
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

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

      {/* Form Content */}
      <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                },
                '&:disabled': {
                  background: '#e0e0e0',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Creating Account...
                </Box>
              ) : (
                'Create Account'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </form>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link 
            to="/auth/login"
            style={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 600
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterForm;