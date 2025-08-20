import { createPurchaseOrder, getAllPurchaseOrders, getPurchaseOrderById, updatePurchaseOrder, deletePurchaseOrder } from "../controllers/PurchaseOrder.controller.js";
import express from "express";

const purchaseOrderRouter = express.Router();

purchaseOrderRouter.post("/create", createPurchaseOrder);
purchaseOrderRouter.put("/update/:id", updatePurchaseOrder);
purchaseOrderRouter.delete("/delete/:id", deletePurchaseOrder);
purchaseOrderRouter.get("/getAll", getAllPurchaseOrders);
purchaseOrderRouter.get("/get/:id", getPurchaseOrderById);

export { purchaseOrderRouter };