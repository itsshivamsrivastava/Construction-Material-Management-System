import BOQ from "../models/BOQ.model.js";

const createBOQ = async (req, res) => {
    try {
        const boq = new BOQ({
            boqNumber: req.body.boqNumber,
            boqItemsDesc: req.body.boqItemsDesc,
            boqUnit: req.body.boqUnit,
            boqQuantity: req.body.boqQuantity,
            boqRate: req.body.boqRate,
            boqAmount: req.body.boqAmount,
        });
        const savedBOQ = await boq.save();
        if (!savedBOQ){
            return res.status(400).json({message: "BOQ items not saved"});
        }
        res.status(200).json({message: "BOQ items saved successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateBOQ = async (req, res) => {
    try {
        const updatedBOQ = await BOQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBOQ) {
            return res.status(404).json({ message: "BOQ not found" });
        }
        const newBOQ = await updatedBOQ.save();
        res.status(200).json(newBOQ);
    } catch (error) {
       res.status(400).json({ message: error.message }); 
    }
};

const deleteBOQ = async (req, res) => {
    try {
        const boq = await BOQ.findById(req.params.id);
        if (!boq) {
            return res.status(404).json({ message: "BOQ not found" });
        }
        await boq.deleteOne();
        res.status(200).json({ message: "BOQ deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBOQ = async (req, res) => {
  try {
    const allBOQ = await BOQ.find();
    res.status(200).json(allBOQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBOQ = async (req, res) => {
    try {
        const boq = await BOQ.findById(req.params.id);
        res.status(200).json(boq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export { createBOQ, updateBOQ, deleteBOQ, getAllBOQ, getBOQ }; 