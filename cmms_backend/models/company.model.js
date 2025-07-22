import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
