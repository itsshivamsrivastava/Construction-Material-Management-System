import mongoose from "mongoose";

const POConsumableSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  supplierDetails: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
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
    type: String,
    required: true,
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

const POConsumable = mongoose.model("POConsumable", POConsumableSchema);
export default POConsumable;
