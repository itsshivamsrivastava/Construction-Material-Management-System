import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
    boq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BOQ',
        required: true,
    },
    materialName: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    packSize: {
        type: Number,
        required: true,
    },
    coefficient: {
        type: Number,
        required: true,
    },
    totalQuantity: {
        type: Number,
        required: true,
    },
    totalQuantityNos: {
        type: Number,
        required: true,
    },
    rateFreezed: {
        type: Number,
        required: true,
    }
});

const Material = mongoose.model('Material', MaterialSchema);
export default Material;