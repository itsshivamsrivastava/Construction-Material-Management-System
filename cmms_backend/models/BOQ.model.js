import mongoose from "mongoose";

const BOQSchema = new mongoose.Schema({
  workorder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkOrder",
  },
  boqNumber: {
    type: String,
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
});

const BOQ = mongoose.model("BOQ", BOQSchema);
export default BOQ;
