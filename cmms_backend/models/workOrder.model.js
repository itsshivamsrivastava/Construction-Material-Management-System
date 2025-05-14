import mongoose from "mongoose";

const WorkOrderSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  clientName: {
    type: String,
    required: true,
  },
  clientNickName: {
    type: String,
  },
  woNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  woDate: {
    type: Date,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  boqNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  boqItemsDesc: {
    type: String,
    required: true,
  },
  boqUnit: {
    type: String,
    required: true,
  },
  boqQuantity: {
    type: Number,
    required: true,
  },
  boqRate: {
    type: Number,
    required: true,
  },
  boqAmount: {
    type: Number,
    required: true,
  },
  woValidityDate: {
    type: Date,
    required: true,
  },
  woCompletionDate: {
    type: Date
  },
  retentionPercentage: {
    type: Number,
    required: true,
  },
  pbgPercentage: {
    type: Number,
    required: true,
  },
  pbgDuration: {
    type: Number,
    required: true,
  },
});

const WorkOrder = mongoose.model("WorkOrder", WorkOrderSchema);
export default WorkOrder;
