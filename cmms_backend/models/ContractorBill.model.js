import mongoose from "mongoose";

const ContractorBillSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  workOrder: {
    type: mongoose.Schema.Types.ObjectId, ref: "WorkOrder"
  },
  contractorName: {
    type: String,
    required: true,
  },
  contractorRABill: {
    type: String,
    required: true,
  },
  billDate: {
    type: Date,
    required: true,
  },
  contractorWONumber: {
    type: String,
    required: true,
  },
  particulars: {
    type: String,
    required: true,
  },
  boqItem: { type: mongoose.Schema.Types.ObjectId, ref: "BOQItem" },
  qtyClaimed: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const ContractorBill = mongoose.model("ContractorBill", ContractorBillSchema);
export default ContractorBill;
