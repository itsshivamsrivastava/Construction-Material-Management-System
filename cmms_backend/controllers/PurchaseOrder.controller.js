import PurchaseOrder from "../models/purchaseOrder.model.js";

const createPurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = new PurchaseOrder(req.body);
        const savedPurchaseOrder = await purchaseOrder.save();
        res.status(201).json(savedPurchaseOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.find().populate('company');
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseOrderById = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate('company');
        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase Order not found' });
        }
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePurchaseOrder = async (req, res) => {
    try {
            const updatePurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatePurchaseOrder) {
                return res.status(404).json({ message: 'Purchase Order not found' });
            }
            res.status(200).json(updatePurchaseOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
};

const deletePurchaseOrder = async (req, res) => {
    try {
            const deletePurchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
            if (!deletePurchaseOrder) {
                return res.status(404).json({ message: 'Purchase Order not found' });
            }
            res.status(200).json({ message: 'Purchase Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};

export { createPurchaseOrder, getAllPurchaseOrders, getPurchaseOrderById, updatePurchaseOrder, deletePurchaseOrder };