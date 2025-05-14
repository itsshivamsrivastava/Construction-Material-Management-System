import {
  createWorkOrder,
  getAllWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  deleteWorkOrder,
} from "../controllers/workOrder.controller.js";
import express from "express";

const workOrderRouter = express.Router();
workOrderRouter.post("/add", createWorkOrder);
workOrderRouter.get("/getAll", getAllWorkOrders);
workOrderRouter.get("/get/:id", getWorkOrderById);
workOrderRouter.put("/update/:id", updateWorkOrder);
workOrderRouter.delete("/delete/:id", deleteWorkOrder);

export { workOrderRouter };
