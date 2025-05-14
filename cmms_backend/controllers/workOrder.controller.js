import WorkOrder from "../models/workOrder.model.js";

const createWorkOrder = async (req, res) => {
    try {
        const workOrder = new WorkOrder({
            company: req.body.company,
            clientName: req.body.clientName,
            clientNickName: req.body.clientNickName,
            woNumber: req.body.woNumber,
            woDate: req.body.woDate,
            projectName: req.body.projectName,
            boqNumber: req.body.boqNumber,
            boqItemsDesc: req.body.boqItemsDesc,
            boqUnit: req.body.boqUnit,
            boqQuantity: req.body.boqQuantity,
            boqRate: req.body.boqRate,
            boqAmount: req.body.boqAmount,
            woValidityDate: req.body.woValidityDate,
            woCompletionDate: req.body.woCompletionDate,
            retentionPercentage: req.body.retentionPercentage,
            pbgPercentage: req.body.pbgPercentage,
            pbgDuration: req.body.pbgDuration
        });
        const savedWorkOrder = await workOrder.save();
        if (!savedWorkOrder) {
            return res.status(400).json({ message: "Work Order not saved" });
        }
        res.status(201).json({ message: "Work Order created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllWorkOrders = async (req, res) => {
    try {
        const getAllWorkOrders = await WorkOrder.find();
        res.status(200).json(getAllWorkOrders);
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getWorkOrderById = async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        res.status(200).json(workOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateWorkOrder = async (req, res) => {
    try {
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWorkOrder) {
            return res.status(404).json({ message: "Work Order not found" });
        }
        const newWorkOrder = await updatedWorkOrder.save();
        res.status(200).json(newWorkOrder);
    } catch (error) {
       res.status(400).json({ message: error.message }); 
    }
};

const deleteWorkOrder = async (req, res) => {
    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(req.params.id);
        if(!deletedWorkOrder) {
            return res.status(404).json({ message: "Work Order not found" });
        }
        res.status(200).json({ message: "Work Order deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createWorkOrder, getAllWorkOrders, getWorkOrderById, updateWorkOrder, deleteWorkOrder };