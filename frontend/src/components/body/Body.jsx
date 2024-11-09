import React, { useState } from "react";

const Body = ({ selectedTable, tableData, loading }) => {
  const [activeTab, setActiveTab] = useState("schema");

  if (!selectedTable) {
    return (
      <div className="p-3 flex-1 overflow-auto">
        Select a table to view details.
      </div>
    );
  }

  return (
    <div className="p-3 flex-1 overflow-hidden">
      <div role="tablist" className="tabs tabs-lifted">
        <button
          className={`tab ${activeTab === "schema" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("schema")}
        >
          Schema
        </button>
        <button
          className={`tab ${activeTab === "preview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
        <button
          className={`tab ${activeTab === "querying" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("querying")}
        >
          Querying
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[84vh] bg-base-100 border-base-300 rounded-box p-6">
        {loading ? (
          <p>Loading table data...</p>
        ) : activeTab === "schema" ? (
          <div>
            <h3 className="text-lg font-bold mb-4">Schema</h3>
            {tableData.schema ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Type</th>
                    <th className="border border-gray-300 px-4 py-2">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.schema.map((field, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {field.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {field.type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {field.mode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No schema available.</p>
            )}
          </div>
        ) : activeTab === "preview" ? (
          <div>
            <h3 className="text-lg font-bold mb-4">Preview</h3>
            {tableData.preview ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(tableData.preview[0] || {}).map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td
                          key={idx}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No preview available.</p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold mb-4">Run a Query</h3>
            {/* Add querying UI here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;