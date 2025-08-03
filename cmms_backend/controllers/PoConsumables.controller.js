import POConsumable from "../models/POConsumable.model.js";

// Create a new POConsumable
const createPOConsumable = async (req, res) => {
    try {
        const poConsumable = new POConsumable(req.body);
        const savedPOConsumable = await poConsumable.save();
        res.status(201).json(savedPOConsumable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPOConsumables = async (req, res) => {
    try {
        const poConsumables = await POConsumable.find().populate('company');
        res.status(200).json(poConsumables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPOConsumableById = async (req, res) => {
    try {
        const poConsumable = await POConsumable.findById(req.params.id).populate('company');
        if (!poConsumable) {
            return res.status(404).json({ message: 'POConsumable not found' });
        }
        res.status(200).json(poConsumable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePOConsumable = async (req, res) => {
    try {
        const updatedPOConsumable = await POConsumable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPOConsumable) {
            return res.status(404).json({ message: 'POConsumable not found' });
        }
        res.status(200).json(updatedPOConsumable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePOConsumable = async (req, res) => {
    try {
        const deletedPOConsumable = await POConsumable.findByIdAndDelete(req.params.id);
        if (!deletedPOConsumable) {
            return res.status(404).json({ message: 'POConsumable not found' });
        }
        res.status(200).json({ message: 'POConsumable deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createPOConsumable, getAllPOConsumables, getPOConsumableById, updatePOConsumable, deletePOConsumable };