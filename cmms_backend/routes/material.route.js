import express from 'express';
import {
    createMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
} from '../controllers/material.controller.js';

const materialRouter = express.Router();

materialRouter.post('/create', createMaterial);
materialRouter.put('/update/:id', updateMaterial);
materialRouter.delete('/delete/:id', deleteMaterial);
materialRouter.get('/getAll', getAllMaterials);
materialRouter.get('/get/:id', getMaterialById);

export { materialRouter };
