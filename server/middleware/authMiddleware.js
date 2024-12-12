
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);}

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role) && !roles.includes(req.user.profile_type)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};


exports.isManager = (req, res, next) => {
  // This should be adjusted based on how you store and check user roles

  if (req.user && req.user.role === 'manager' || req.user.profile_type === 'manager') {
    next();
  } else {
    res.status(403).json({ error: 'Only managers can perform this action' });
  }
};


exports.checkInstitutionOrder = (req, res, next) => {
  if (req.user.profile_type === 'institution') {
    const { quantity } = req.body;
    // Assuming you store the weight of each product in kg
    const productWeight = 1; // Default to 1kg if weight is not available

    if (quantity  < 20) {
      return res.status(400).json({
        error: 'Institutions must order at least 20kg of product'
      });
    }
  }
  next();
};
