import {
    createPOConsumable,
    getAllPOConsumables,
    getPOConsumableById,
    updatePOConsumable,
    deletePOConsumable,
} from '../controllers/PoConsumables.controller.js';
import express from 'express';

const poConsumableRouter = express.Router();

poConsumableRouter.post('/create', createPOConsumable);
poConsumableRouter.put('/update/:id', updatePOConsumable);
poConsumableRouter.delete('/delete/:id', deletePOConsumable);
poConsumableRouter.get('/getAll', getAllPOConsumables);
poConsumableRouter.get('/get/:id', getPOConsumableById);

export { poConsumableRouter };