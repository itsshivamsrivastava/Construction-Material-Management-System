import React, { useState, useEffect } from "react";
import "./WorkorderViewStyle.css";
import Sidebar from "../Sidebar/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkorderView = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [workOrders, setWorkOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [boq, setBoq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const workOrdersPerPage = 2;
  const totalPages = Math.ceil(workOrders.length / workOrdersPerPage);
  const currentWorkOrders = workOrders.slice(
    currentPage * workOrdersPerPage,
    currentPage * workOrdersPerPage + workOrdersPerPage
  );

  const navigate = useNavigate();

  // Fetch all work orders
  const fetchWorkOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/workorder/getAll");
      setWorkOrders(res.data);
    } catch {
      console.log("Failed to fetch work orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  // Fetch all Company data
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/company/getCompany");
      setCompanies(res.data);
    } catch {
      console.log("Failed to fetch companies");
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch all BOQ data
  const fetchBoq = async () => {
    try{
        const res = await axios.get("http://localhost:3000/api/boq/getAll");
        setBoq(res.data);
    }catch{
        console.log("Failed to fetch BOQ");
    
    }
  };
  useEffect(() => {
    fetchBoq();
  }, []);
  
  // Helper Function to get Company Name from id or object
  const getCompanyName = (company) => {
    // If company is an object, get its _id
    const companyId = typeof company === "object" && company !== null ? company._id : company;
    const companyObj = companies.find((c) => c._id === companyId);
    return companyObj ? companyObj.name : companyId;
  };

  // Helper Function to get BOQ Number label from id or object
  const getBoqNumberLabel = (boqItem) => {
    const id = Array.isArray(boqItem) ? boqItem[0] : boqItem;
    const boqObj = boq.find((b) => b._id === id);
    return boqObj ? boqObj.boqNumber : id;
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work order?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/workorder/delete/${id}`);
      fetchWorkOrders();
    } catch {
      setError("Failed to delete work order");
    }
    setLoading(false);
  };

  return (
    <div className="workorder-page-container flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <Sidebar title="Workorder" />

      {/* Main Content */}
      <main className="workorder-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-3 mt-10 text-center main-container">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
            View All Work Orders
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            View all work orders here and manage them.
          </p>
          <div className="mb-8 mt-10 text-center">
          <button
              type="button"
              className="w-42 mx-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer" onClick={() =>
                navigate("/dashboard")
              }
            >
            Dashboard
            </button>
            
            <button
              type="button"
              className="w-42 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer" onClick={() =>
                navigate("/manage-workorder")
              }
            >
              Add Workorder
            </button>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              aria-label="Previous"
            >
              &#8592; Previous
            </button>
            <span className="font-semibold">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              aria-label="Next"
            >
              Next &#8594;
            </button>
          </div>

          {/* Card view for all screens, two cards per row */}
          {loading ? (
            <div className="text-blue-500 text-center py-8 font-semibold animate-pulse">
              Loading...
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8 font-semibold animate-pulse">
              {error}
            </div>
          ) : workOrders.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No work orders found.
            </div>
          ) : (
            <div className="workorder-card-container">
              {currentWorkOrders.map((wo) => (
                <div
                  key={wo._id}
                  className="workorder-card"
                >
                  <div className="workorder-card-row mb-2">
                    <span className="font-bold text-blue-700">WO Number:</span>
                    <button
                      title="Edit"
                      className="text-black-600 hover:text-blue-900 hover:underline cursor-pointer"
                    >
                      {wo.woNumber}
                    </button>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Client Name:</span>
                    <span>{wo.clientName}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Company:</span>
                    <span>{getCompanyName(wo.company)}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Project Name:</span>
                    <span>{wo.projectName}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">BOQ Number:</span>
                    <span>{getBoqNumberLabel(wo.boqNumber)}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Work Order Date:</span>
                    <span>{wo.woDate}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Work Order Validity:</span>
                    <span>{wo.woValidityDate}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Work Order Completion:</span>
                    <span>{wo.woCompletionDate}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Work Order Amount:</span>
                    <span>{wo.workorderAmount}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">Retention %:</span>
                    <span>{wo.retentionPercentage}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">PBG %:</span>
                    <span>{wo.pbgPercentage}</span>
                  </div>
                  <div className="workorder-card-row">
                    <span className="font-bold">PBG Duration:</span>
                    <span>{wo.pbgDuration}</span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button
                      title="Edit"
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => navigate(`/manage-workorder/${wo._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(wo._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          )}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              aria-label="Previous"
            >
              &#8592; Previous
            </button>
            <span className="font-semibold">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              aria-label="Next"
            >
              Next &#8594;
            </button>
          </div>
      </main>
    </div>
  );
};

export default WorkorderView;
