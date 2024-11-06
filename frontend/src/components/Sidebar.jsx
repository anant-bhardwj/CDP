import React from "react";
import useGetTableNames from "../hooks/useGetTableNames.js";

const Sidebar = () => {
  const { tables, loading } = useGetTableNames();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 text-base-content p-4 flex flex-col">
        {/* Sidebar Header */}
        <div className="mb-6 text-lg font-bold text-primary">My Tables</div>

        {/* Display Tables */}
        {loading ? (
          <div>Loading tables...</div>
        ) : (
          <nav className="space-y-4">
            {tables.length > 0 ? (
              tables.map((tableName) => (
                <a
                  key={tableName}
                  href="#"
                  className="flex items-center p-2 rounded-lg hover:bg-primary hover:text-white transition"
                >
                  <span className="material-icons mr-3"></span>
                  {tableName}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No tables available</p>
            )}
          </nav>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
