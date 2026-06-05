import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Check if a user has a token saved in their browser
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Route for the Feed */}
      <Route path="/" element={
        isAuthenticated ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Authentication Successful!</h2>
            <p>This is where the Feed will go next.</p>
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export default App;