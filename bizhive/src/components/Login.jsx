import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  LoginOutlined,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { API_BASE_URL } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo login bypass
    if (formData.email === 'admin@gmail.com' && formData.password === '12345') {
      localStorage.setItem('userRole', 'ADMIN');
      navigate('/admin-dashboard');
      setLoading(false);
      return;
    }
    if (formData.email === 'enterprise@gmail.com' && formData.password === '1234') {
      localStorage.setItem('userRole', 'ENTERPRISE');
      localStorage.setItem('userDetails', JSON.stringify({
        enterpriseName: 'Example Enterprise',
        msmeRegNo: 'MSME123456',
        loginId: 'enterprise@gmail.com',
        employeeCount: 42,
        annualTurnover: '₹1.2Cr',
        city: 'Chennai',
        typeOfBusiness: 'Manufacturing',
        registeredAddress: '123, Industrial Area, Chennai',
        factoryLocation: 'Chennai',
        branchOffices: 'Bangalore, Hyderabad',
        msmeRegistrationStatus: 'Registered',
        gstStatus: 'Active',
        factoryLicenseStatus: 'Valid',
        primaryContact: 'Mr. Kumar',
        email: 'enterprise@gmail.com',
        phoneNumber: '+91-9876543210',
        id: 1
      }));
      navigate('/msme-dashboard');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Store user details and role
        let role = response.data.role;
        if (role === 'MSME' || role === 'ENTERPRISE_USER') role = 'ENTERPRISE';
        localStorage.setItem('userRole', role);
        
        // Store user details based on role
        if (role === 'ADMIN') {
          localStorage.setItem('userDetails', JSON.stringify(response.data.adminDetails));
          navigate('/admin-dashboard');
        } else if (role === 'ENTERPRISE') {
          localStorage.setItem('userDetails', JSON.stringify(response.data.enterpriseDetails));
          navigate('/msme-dashboard');
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={1000}>
          <Paper className="login-paper" elevation={6}>
            <Box
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AccountCircle className="login-icon" />
              <Typography component="h1" variant="h4" className="login-title">
                <span className="biz">Biz</span>
                <span className="hive">HIVE</span>
              </Typography>
              <Typography component="h2" variant="h6" className="login-subtitle">
                Welcome Back!
              </Typography>

              {/* Demo credentials info */}
              <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
                <strong>Demo Credentials:</strong><br />
                <span>MSME: <b>enterprise@gmail.com</b> / <b>1234</b></span>
              </Alert>

              {error && (
                <Alert severity="error" className="error-alert">
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} className="login-form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
                  disabled={loading}
                  className={`login-input ${loading ? 'loading' : ''}`}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: '#1976d2',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!error}
                  helperText={error}
                  disabled={loading}
                  className={`login-input ${loading ? 'loading' : ''}`}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: '#1976d2',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className="visibility-icon"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className="login-button"
                  endIcon={<LoginOutlined />}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" className="signup-text">
                    Don't have an account?
                  </Typography>
                  <Button
                    onClick={() => navigate('/signup')}
                    className="signup-link"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    REGISTER YOUR ENTERPRISE
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default Login; 