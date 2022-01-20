import jwt from 'jsonwebtoken';

import pool from '../db.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({
      status: 401,
      error: 'no token present',
    });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      error: 'invalid token',
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { username } = req.user;
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  if (user.rows[0].isadmin === true) {
    return next();
  }
  res.status(401).json({
    status: 401,
    message: 'only Admins are allowed to view this route',
  });
};

const createdBy = async (req, res, next) => {
  const { id } = req.user;
  const { parcelId } = req.params;
  const parcel = await pool.query('SELECT * FROM parcels WHERE id= $1', [parcelId]);

  if (parcel.rows.length === 0) {
    return res.status(400).json({ message: `no parcel with that id ${parcelId}` });
  }

  if (parcel.rows[0].placedby !== id) {
    return res.status(401).json({
      status: 401,
      message: 'not permitted to access this route',
    });
  }
  next();
};

export { authenticateToken, isAdmin, createdBy };
