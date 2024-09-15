import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

async function authenticateToken (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token' });
        } else if (err.name === 'NotBeforeError') {
          return res.status(401).json({ error: 'Token not active yet' });
        } else {
          return res.status(500).json({ error: 'Failed to authenticate token' });
        }
      }

      const user = await User.findOne({
        where: {
          id: payload.userId
        }
      })
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
      next();
    })
  } catch(err) {
    console.log("Error:", err, "===err");
    res.status(500).json({
      message: "Internal server error",
      error: err,
    })
  }
}

export default authenticateToken;