import Material from '../models/material.model.js';

// Create a new material
const createMaterial = async (req, res) => {
    try {
        const material = new Material(req.body);
        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all materials
const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get material by ID
const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update material by ID
const updateMaterial = async (req, res) => {
    try {
        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.status(200).json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete material by ID
const deleteMaterial = async (req, res) => {
    try {
        const deletedMaterial = await Material.findByIdAndDelete(req.params.id);
        if (!deletedMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial };