import React from "react";
import useGetTableNames from "../hooks/useGetTableNames.js";

const Sidebar = ({ onSelectTable, selectedTable }) => {
  const { tables, loading } = useGetTableNames();

  return (
    <aside className="w-64 bg-base-200 text-base-content p-4 flex flex-col">
      <div className="mb-6 text-lg font-bold text-primary">My Tables</div>
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
    </aside>
  );
};

export default Sidebar;
