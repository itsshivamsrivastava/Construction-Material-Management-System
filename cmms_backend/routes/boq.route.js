import express from 'express';
import { createBOQ, updateBOQ, deleteBOQ, getAllBOQ, getBOQ, getBOQByWorkorder } from '../controllers/BOQ.controller.js';

const boqRouter = express.Router();

boqRouter.post("/create", createBOQ);
boqRouter.put("/update/:id", updateBOQ);
boqRouter.delete("/delete/:id", deleteBOQ);
boqRouter.get("/get/:id", getBOQ);
boqRouter.get("/getAll", getAllBOQ);
boqRouter.get("/byWorkorder/:workorderId", getBOQByWorkorder);

export { boqRouter };