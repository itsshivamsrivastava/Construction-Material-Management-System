import express from 'express';
import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/company.controller.js';

const companyRouter = express.Router();

companyRouter.post('/addCompany', createCompany);

companyRouter.get('/getCompany', getCompanies);

companyRouter.get('/getcompany/:id', getCompanyById);

companyRouter.put('/updateCompany/:id', updateCompany);

companyRouter.delete('/deleteCompany/:id', deleteCompany);

export { companyRouter };