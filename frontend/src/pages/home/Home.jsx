import React, { useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/sidebar.jsx";
import Body from "../../components/body/Body.jsx";
import useGetTableData from "../../hooks/useGetTableData.js";

const Home = () => {
  const [selectedTable, setSelectedTable] = useState(null); //tracks selected table
  const { tableData, getTableData, loading } = useGetTableData();

  const handleSelectTable = (tableName) => {
    setSelectedTable(tableName);
    getTableData(tableName);
  };

  return (
    <div className="h-screen flex flex-col bg-base-300">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar
          onSelectTable={handleSelectTable}
          selectedTable={selectedTable}
        />
        <Body
          selectedTable={selectedTable}
          tableData={tableData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Home;
