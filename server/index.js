import express, { json, urlencoded } from 'express';
import authRoutes from './routes/authRoutes.js';
import parcelRoutes from './routes/parcelRoutes.js';
import userRoutes from './routes/userRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// middlewares

app.use(json());
app.use(urlencoded({ extended: false }));
// app.use(expressValidator());

// api routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/parcels/', parcelRoutes);
app.use('/api/v1/users/', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

export default app;
