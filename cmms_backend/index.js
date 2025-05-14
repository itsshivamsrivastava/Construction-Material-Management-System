import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { companyRouter } from './routes/company.route.js';
import { authRouter } from './routes/auth.route.js';
import { workOrderRouter } from './routes/workorder.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error: ', error);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000 => http://localhost:3000');
});

app.use('/api/company', companyRouter);
app.use('/api/auth', authRouter);
app.use('/api/workorder', workOrderRouter);