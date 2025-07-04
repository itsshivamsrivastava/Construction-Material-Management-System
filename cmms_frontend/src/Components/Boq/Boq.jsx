import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./BOQStyle.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";


const BOQ = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [boqs, setBoqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const boqPerPage = 2;
  const totalPages = Math.ceil(boqs.length / boqPerPage);
  const currentBOQ = boqs.slice(
    currentPage * boqPerPage,
    currentPage * boqPerPage + boqPerPage
  );

  // Fetch all BOQ data
  const fetchBoq = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/boq/getAll");
      setBoqs(res.data);
    } catch {
      console.log("Failed to fetch BOQ");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBoq();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this BOQ?")) return;
    setLoading(true);
    setError("");
    try {
        await axios.delete(`http://localhost:3000/api/boq/delete/${id}`);
        fetchBoq();
    } catch {
      setError("Failed to delete BOQ");
    }
    setLoading(false);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };
  return (
    <div className="boq-page-container flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <Sidebar title="BOQ" />

      {/* Main Content */}
      <main className="boq-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-3 mt-10 text-center main-container">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
            View all BOQs
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            View all BOQs here and manage them.
          </p>
          <div className="mb-8 mt-10 text-center">
            <button
              type="button"
              className="w-42 mx-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>
            <button
              type="button"
              className="w-42 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer"
              onClick={() => {
                navigate("/manage-boq");
              }}
            >
              Add BOQ
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
          ) : boqs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No work orders found.
            </div>
          ) : (
            <div className="boq-card-container">
                {currentBOQ.map((boq) => (
                    <div key={boq._id} className="boq-card">
                        <div className="boq-card-row mb-2">
                            <span className="font-bold text-blue-700">BOQ Number:</span>
                            <button
                              title="Edit"
                              className="text-black-600 hover:text-blue-900 hover:underline cursor-pointer"
                            >
                              {boq.boqNumber}
                            </button>
                        </div>
                        <div className="boq-card-row mb-2">
                            <span className="font-bold">BOQ Description:</span>
                            <span>{boq.boqItemsDesc}</span>
                        </div>
                        <div className="boq-card-row mb-2">
                            <span className="font-bold">BOQ Unit</span>
                            <span>{boq.boqUnit}</span>
                        </div>
                        <div className="boq-card-row mb-2">
                            <span className="font-bold">BOQ Quantity</span>
                            <span>{boq.boqQuantity}</span>
                        </div>
                        <div className="boq-card-row mb-2">
                            <span className="font-bold">BOQ Rate</span>
                            <span>{boq.boqRate}</span>
                        </div>
                        <div className="boq-card-row mb-2">
                            <span className="font-bold">BOQ Amount</span>
                            <span>{boq.boqmount}</span>
                        </div>

                        <div className="flex gap-4 mt-2">
                    <button
                      title="Edit"
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => navigate(`/manage-boqs/${boq._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Delete"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(boq._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BOQ;
