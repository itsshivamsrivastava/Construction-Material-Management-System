import mongoose from "mongoose";

const MaterialReceiptSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    workOrder: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' 
    },
    supplierNumber: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    material: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Material' 
    },
    qty: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    otherCharges: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const MaterialReceipt = mongoose.model('MaterialReceipt', MaterialReceiptSchema);
export default MaterialReceipt;