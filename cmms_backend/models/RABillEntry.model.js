import mongoose from "mongoose";

const RABillEntrySchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  workOrder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "WorkOrder"
  },
  raBillNumber: { 
    type: String, 
    unique: true,
    required: true,
  },
  raBillDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  taxInvoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  taxInvoiceDate: {
    type: Date,
    required: true,
  },
  boqItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "BOQItem" 
  },
  rate: {
    type: Number,
    required: true,
  },
  billQty: {
    type: Number,
    required: true,
  },
  billAmount: {
    type: Number,
    required: true,
  },
  attachment: {
    type: String,
  },
});

const RABillEntry = mongoose.model("RABillEntry", RABillEntrySchema);
export default RABillEntry;
