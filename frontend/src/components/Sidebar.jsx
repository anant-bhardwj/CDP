import React, { useState } from "react";
import useGetTableNames from "../hooks/useGetTableNames.js";
import NewTableForm from "./newTableForm.jsx";

const Sidebar = ({ onSelectTable, selectedTable }) => {
  const { tables, loading, refreshTables } = useGetTableNames();
  const [showModal, setShowModal] = useState(false);

  const handleAddTable = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleTableSubmit = async () => {
    console.log("Submitting table and refreshing.....");

    await refreshTables();
    handleCloseModal();
  };

  return (
    <aside className="w-64 bg-base-200 text-base-content p-4 flex flex-col">
      <div className="mb-6 text-lg font-bold text-primary">My Tables</div>

      {/* Add New Table Button */}
      <button className="btn btn-primary mb-4" onClick={handleAddTable}>
        Add New Table
      </button>

      {loading ? (
        <div>Loading tables...</div>
      ) : (
        <nav className="space-y-4">
          {tables.length > 0 ? (
            tables.map((tableName) => (
              <button
                key={tableName}
                className={`w-full text-left flex items-center p-2 rounded-lg ${
                  selectedTable === tableName
                    ? "bg-primary text-white"
                    : "hover:bg-primary hover:text-white"
                } transition`}
                onClick={() => onSelectTable(tableName)} // Notify parent about the selection
              >
                <span className="material-icons mr-3"></span>
                {tableName}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No tables available</p>
          )}
        </nav>
      )}

      {/* Modal for New Table Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <NewTableForm
            onClose={handleCloseModal}
            onSubmit={handleTableSubmit}
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
