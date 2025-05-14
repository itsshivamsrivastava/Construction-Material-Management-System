import Company from "../models/company.model.js";

// Create a new company
const createCompany = async (req, res) => {
    const company = new Company({
        name: req.body.name,
        gstNumber: req.body.gstNumber,
        location: req.body.location
    });
    try {
        const savedCompany = await company.save();
        res.status(201).json(savedCompany);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

// Update an existing company
const updateCompany = async (req, res) => {
    const companyId = req.params.id;
    try {
        const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

// Delete a company
const deleteCompany = async (req, res) => {
    const companyId = req.params.id;
    try {
        const deletedCompany = await Company.findByIdAndDelete(companyId);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    }
    catch (err) {
        res.status(500).json(err);
    }
};

// Get all companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

// Get a company by ID
const getCompanyById = async (req, res) => {
    const companyId = req.params.id;
    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };