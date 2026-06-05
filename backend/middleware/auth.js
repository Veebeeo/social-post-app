const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // The token usually comes as "Bearer <token_string>", so we split it
    const actualToken = token.split(' ')[1] || token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Attach the user payload to the request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};