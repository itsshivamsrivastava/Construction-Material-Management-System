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
    { name: "Work Orders", icon: <MdOutlineShoppingCart />, path: "/workorders" },
    { name: "BOQ", icon: <CiMoneyBill />, path: "/manage-boq"},
    { name: "Contractor Bills", icon: <RiBillLine />, path: "/contractor-bills" },
    { name: "Materials", icon: <MdOutlineConstruction />, path: "/manage-materials" },
    { name: "PO Consumables", icon: <BiSolidPurchaseTagAlt />, path: "/poconsumables" },
    { name: "Purchase Orders", icon: <BiPurchaseTagAlt />, path: "/purchase-orders" },
    { name: "RA Bill Entry", icon: <CiMoneyBill />, path: "/ra-bills" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
              className="sidebar-close absolute top-6 left-68 text-2xl text-blue-700 bg-white rounded-full py-1 px-2 pb-2 shadow shadow-blue-300 focus:outline-none"
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
      <aside
        className={`sidebar-lg-screen sidebar hidden md:block bg-white/90 border-r border-blue-100 shadow-lg py-8 px-4 flex-shrink-0 sticky top-0 z-10 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Cross button absolutely positioned at top right when expanded */}
        {!sidebarCollapsed && (
          <button
            className="sidebar-cross-desktop absolute top-6 left-65 bg-white text-blue-700 py-1 px-3 pb-2 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 hover:text-blue-900 transition focus:outline-none md:block"
            style={{ display: "block" }}
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <span className="text-2xl font-bold">×</span>
          </button>
        )}
        <nav className={sidebarCollapsed ? "mt-12" : "mt-0"}>
          <div className={`items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} mb-4`}>
            <h2
              className={`text-size-lg md:text-2xl font-bold text-blue-700 drop-shadow-lg transition-all duration-300 ${
                sidebarCollapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100"
              }`}
              style={{ minHeight: sidebarCollapsed ? 0 : undefined }}
            >
              {title}
            </h2>
            {/* Hamburger icon only when collapsed */}
            {sidebarCollapsed && (
              <button
                className="sidebar-hamburger-desktop bg-white text-blue-700 p-2 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 hover:text-blue-900 transition focus:outline-none md:block"
                style={{ display: "block", marginTop: "-3rem" }}
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Expand sidebar"
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
            )}
          </div>
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li key={mod.path}>
                <button
                  className={`sidebar-link w-full text-left px-4 py-3 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition flex items-center gap-2 ${
                    window.location.pathname === mod.path
                      ? "bg-blue-100 text-blue-900 font-bold shadow"
                      : ""
                  } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  onClick={() => handleModuleClick(mod.path)}
                  aria-current={
                    window.location.pathname === mod.path ? "page" : undefined
                  }
                >
                  <span className="text-lg">{mod.icon}</span>
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      sidebarCollapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100 ml-2"
                    }`}
                    style={{ minWidth: sidebarCollapsed ? 0 : undefined }}
                  >
                    {mod.name}
                  </span>
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
