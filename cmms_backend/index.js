import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { companyRouter } from './routes/company.route.js';
import { authRouter } from './routes/auth.route.js';
import { workOrderRouter } from './routes/workorder.route.js';
import { ContractorBillrouter } from './routes/contractorBill.route.js';
import { boqRouter } from './routes/boq.route.js';
import { materialRouter } from './routes/material.route.js';
import { poConsumableRouter } from './routes/PoConsumables.route.js';
import { purchaseOrderRouter } from './routes/purchaseOrder.route.js';

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
app.use('/api/contractorBill', ContractorBillrouter);
app.use('/api/boq', boqRouter);
app.use('/api/material', materialRouter);
app.use('/api/poConsumable', poConsumableRouter);
app.use('/api/purchaseOrder', purchaseOrderRouter);