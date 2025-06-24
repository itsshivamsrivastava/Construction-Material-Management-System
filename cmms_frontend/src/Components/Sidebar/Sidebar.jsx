import React, { useState } from "react";
import "./SidebarStyle.css";
import { FaRegBuilding } from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";
import { MdOutlineConstruction } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import { BiPurchaseTagAlt, BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaBell, FaSearch } from "react-icons/fa";
// import { FaChevronDown, FaChevronRight, FaGears } from "react-icons/fa6";
// import { MdSpaceDashboard } from "react-icons/md";
// import { RiAdminFill } from "react-icons/ri";

const Sidebar = ({title}) => {
  const modules = [
    { name: "Companies", icon: <FaRegBuilding />, path: "/companies" },
    { name: "Work Orders", icon: <MdOutlineShoppingCart />, path: "/work-orders" },
    { name: "Contractor Bills", icon: <RiBillLine />, path: "/contractor-bills" },
    { name: "Materials", icon: <MdOutlineConstruction />, path: "/materials" },
    { name: "PO Consumables", icon: <BiSolidPurchaseTagAlt />, path: "/po-consumables" },
    { name: "Purchase Orders", icon: <BiPurchaseTagAlt />, path: "/purchase-orders" },
    { name: "RA Bill Entry", icon: <CiMoneyBill />, path: "/ra-bills" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // For navigation
  const handleModuleClick = (path) => {
    window.location.href = path;
  };

  // Close sidebar on overlay click (mobile)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("sidebar-overlay")) {
      setSidebarOpen(false);
    }
  };
  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden w-full flex items-start">
        <button
          className="sidebar-hamburger mt-4 ml-2 z-50 bg-white text-blue-700 p-2 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 hover:text-blue-900 transition focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={handleOverlayClick}
        >
          <aside className="sidebar mobile-open animate-slide-in-left">
            <button
              className="sidebar-close absolute top-4 right-4 text-2xl text-blue-700 bg-white rounded-full p-1 shadow focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
            <nav>
              <h2 className="text-size md:text-2xl font-bold text-blue-700 drop-shadow-lg">
              {title}
              </h2>
              <ul className="space-y-2">
                {modules.map((mod) => (
                  <li key={mod.path}>
                    <button
                      className={`sidebar-link w-full text-left px-4 py-3 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition ${
                        window.location.pathname === mod.path
                          ? "bg-blue-100 text-blue-900 font-bold shadow"
                          : ""
                      }`}
                      onClick={() => handleModuleClick(mod.path)}
                      aria-current={
                        window.location.pathname === mod.path
                          ? "page"
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{mod.icon}</span>
                        <span
                          className={`${
                            !open && "hidden"
                          } origin-left ease-in-out duration-300`}
                        >
                          {mod.name}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Sidebar for desktop */}
      <aside className="sidebar-lg-screen sidebar hidden md:block w-64 bg-white/90 border-r border-blue-100 shadow-lg py-8 px-4 flex-shrink-0 sticky top-0 z-10">
        <nav>
          <h2 className="text-size-lg md:text-2xl font-bold text-blue-700 mb-2 drop-shadow-lg">
            {title}
          </h2>
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li key={mod.path}>
                <button
                  className={`sidebar-link w-full text-left px-4 py-3 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition ${
                    window.location.pathname === mod.path
                      ? "bg-blue-100 text-blue-900 font-bold shadow"
                      : ""
                  }`}
                  onClick={() => handleModuleClick(mod.path)}
                  aria-current={
                    window.location.pathname === mod.path ? "page" : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mod.icon}</span>
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left ease-in-out duration-300`}
                    >
                      {mod.name}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
