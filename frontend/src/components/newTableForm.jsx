import React, { useState } from "react";
import toast from "react-hot-toast";
import useSubmitTable from "../hooks/useSubmitTable";

const newTableForm = ({ onClose, onSubmit }) => {
  const [newTable, setNewTable] = useState("");
  const [file, setFile] = useState(null);

  const { loading, submitTable } = useSubmitTable();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await submitTable(newTable, file);

    if (result) {
      toast.success("Table created successfully");
      onSubmit();
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-80">
      <h2 className="text-lg font-bold mb-4">Add New Table</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="tableName">
            Table Name
          </label>
          <input
            id="tableName"
            type="text"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter table name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="file">
            Upload CSV File
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-ghost mr-2"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default newTableForm;
