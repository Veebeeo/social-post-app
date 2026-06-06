import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://social-post-app-u6t2.onrender.com/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" mb={3}>Create Account</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField fullWidth label="Username" margin="normal" required
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <TextField fullWidth label="Email" type="email" margin="normal" required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Typography align="center" variant="body2">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}