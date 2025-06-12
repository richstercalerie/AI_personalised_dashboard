const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers.token || req.cookies.token;
  if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

  try {
    const decoded = jwt.verify(token, "myverysecuresecretkey123");
    req.user = decoded; // { _id, isAdmin, email }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };