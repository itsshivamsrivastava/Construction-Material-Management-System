import ContractorBills from "../models/ContractorBill.model.js";

const create = async (req, res) => {
    const constractorBill = new ContractorBills({
        projectName: req.body.projectName,
        workOrder: req.body.workOrder,
        contractorRABill: req.body.contractorRABill,
        billDate: req.body.billDate,
        particulars: req.body.particulars,
        boqItem: req.body.boqItem,
        qtyClaimed: req.body.qtyClaimed,
        rate: req.body.rate,
        amount: req.body.amount,
    });
    try {
        const savedContractorBill = await constractorBill.save();
        res.status(201).json(savedContractorBill);
    } catch (err) {
        res.status(500).json(err);
    }
};

const update = async (res, req) => {
    const contractorBillId = req.params.id;
    try {
        const updatedContractorBill = await ContractorBills.findByIdAndUpdate(contractorBillId, req.body, { new: true });
        if (!updatedContractorBill) {
            return res.status(404).json({ message: 'Contractor Bill not found' });
        }
        res.status(200).json(updatedContractorBill);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteContractorBill = async (req, res) => {
    const contractorBillId = req.params.id;
    try {
        const deletedContractorBill = await ContractorBills.findByIdAndDelete(contractorBillId);
        if (!deletedContractorBill) {
            return res.status(404).json({ message: 'Contractor Bill not found' });        
        }
        res.status(200).json({ message: 'Contractor Bill deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllContractorBills = async (req, res) => {
    try {
        const contractorBills = await ContractorBills.find();
        res.status(200).json(contractorBills);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getContractorBillById = async (req, res) => {
    const contractorBillId = req.params.id;
    try {
        const contractorBill = await ContractorBills.findById(contractorBillId);
    } catch (err) {
        res.status(500).json(err);
    }
};

export { create, update, deleteContractorBill, getAllContractorBills, getContractorBillById };