import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  supplierDetails: {
    type: String,
    required: true,
  },
  projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkOrder",
    required: true,
  },
  poNumber: {
    type: String,
    required: true,
  },
  poDate: {
    type: Date,
    required: true,
  },
  materialName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
  },
  unit: {
    type: String,
    required: true,
  },
  qtyToOrder: {
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
  paymentTerms: {
    type: String,
    required: true,
  },
  otherTerms: {
    type: String,
    required: true,
  },
  taxDetails: {
    cgst: {
      type: Number,
      required: true,
    },
    sgst: {
      type: Number,
      required: true,
    },
    igst: {
      type: Number,
      required: true,
    },
  },
  otherCharges: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;
