import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const jwtToken = (user_id, user_name) => {
  const payload = {
    id: user_id,
    username: user_name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default jwtToken;
