import express from "express";

import { create, update, deleteContractorBill, getAllContractorBills, getContractorBillById } from "../controllers/ContractorBills.controller.js";

const ContractorBillrouter = express.Router();

ContractorBillrouter.post("/createCotractorBill", create);
ContractorBillrouter.put("/updateContractorBill/:id", update);
ContractorBillrouter.get("/getAllContractorBills", getAllContractorBills);
ContractorBillrouter.get("/getContractorBillById/:id", getContractorBillById);
ContractorBillrouter.delete("/deleteContractorBill/:id", deleteContractorBill);

export { ContractorBillrouter };