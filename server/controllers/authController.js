import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwtToken from '../utils/jwtGenerator.js';

import pool from '../db.js';

dotenv.config();

const signUpController = async (req, res) => {
  try {
    const { firstname, lastname, email, username, isAdmin, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(400).json({
        error: 'Email already taken',
        status: 400,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (first_name,last_name,email,username,isadmin,password) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *',
      [firstname, lastname, email, username, isAdmin, hashedPassword]
    );

    const createdUser = {
      id: newUser.rows[0].id,
      firstname: newUser.rows[0].first_name,
      lastname: newUser.rows[0].last_name,
      email: newUser.rows[0].email,
      username: newUser.rows[0].username,
      isAdmin: newUser.rows[0].isadmin,
    };

    const token = jwtToken(newUser.rows[0].id, newUser.rows[0].username);
    res.status(201).json({
      status: 201,
      data: {
        token,
        user: createdUser,
      },
    });
    // console.log();
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({
        status: 401,
        error: 'incorrect email',
      });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        error: 'incorrect paswword',
      });
    }
    const loggedUser = {
      id: user.rows[0].id,
      firstname: user.rows[0].first_name,
      lastname: user.rows[0].last_name,
      email: user.rows[0].email,
      username: user.rows[0].username,
      isAdmin: user.rows[0].isadmin,
    };

    const token = jwtToken(user.rows[0].id, user.rows[0].username);
    res.json({
      status: 200,
      data: {
        token,
        user: loggedUser,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { signUpController, loginController };
