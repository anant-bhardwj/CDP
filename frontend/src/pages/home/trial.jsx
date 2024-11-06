import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Search, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

const tables = [
  { 
    name: 'testData1', 
    schema: [
      { name: 'edition', type: 'INTEGER', mode: 'NULLABLE' },
      { name: 'report_type', type: 'STRING', mode: 'NULLABLE' },
      { name: 'measure_name', type: 'STRING', mode: 'NULLABLE' },
      { name: 'state_name', type: 'STRING', mode: 'NULLABLE' },
      { name: 'subpopulation', type: 'STRING', mode: 'NULLABLE' },
      { name: 'value', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'lower_ci', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'upper_ci', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'source', type: 'STRING', mode: 'NULLABLE' },
      { name: 'source_date', type: 'STRING', mode: 'NULLABLE' },
    ],
    data: [
      { edition: 2023, report_type: 'Annual', measure_name: 'Revenue', state_name: 'California', subpopulation: 'All', value: 1000000, lower_ci: 950000, upper_ci: 1050000, source: 'Internal', source_date: '2023-10-01' },
      { edition: 2023, report_type: 'Annual', measure_name: 'Profit', state_name: 'New York', subpopulation: 'All', value: 500000, lower_ci: 480000, upper_ci: 520000, source: 'Internal', source_date: '2023-10-01' },
      { edition: 2023, report_type: 'Quarterly', measure_name: 'Sales', state_name: 'Texas', subpopulation: 'Retail', value: 750000, lower_ci: 720000, upper_ci: 780000, source: 'External', source_date: '2023-09-30' },
    ]
  },
  { 
    name: 'testData2', 
    schema: [
      { name: 'id', type: 'INTEGER', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'NULLABLE' },
      { name: 'age', type: 'INTEGER', mode: 'NULLABLE' },
    ],
    data: [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 28 },
      { id: 3, name: 'Bob Johnson', age: 35 },
    ]
  },
]

export default function App() {
  const [selectedTable, setSelectedTable] = useState(tables[0])
  const [activeTab, setActiveTab] = useState('Schema')
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)

  const runQuery = () => {
    const lowercaseQuery = query.toLowerCase()
    if (lowercaseQuery.includes('select') && lowercaseQuery.includes('from')) {
      const columns = lowercaseQuery.split('select')[1].split('from')[0].trim().split(',').map(col => col.trim())
      const result = selectedTable.data.map(row => {
        const newRow = {}
        columns.forEach(col => {
          if (col === '*') {
            Object.assign(newRow, row)
          } else {
            newRow[col] = row[col]
          }
        })
        return newRow
      })
      setQueryResult(result)
    } else {
      setQueryResult([{ error: 'Invalid query. Please use a SELECT statement.' }])
    }
  }

  const downloadData = (format) => {
    if (!queryResult) return

    const filename = `query_result.${format}`
    const data = queryResult

    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Query Result')
      XLSX.writeFile(wb, filename)
    }

    setShowDownloadOptions(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">user_9_dataset</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <Download className="h-5 w-5" />
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button
                      onClick={() => downloadData('csv')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      Download as CSV
                    </button>
                    <button
                      onClick={() => downloadData('xlsx')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                    >
                      Download as XLSX
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm overflow-y-auto border-r border-gray-200">
          <nav className="mt-5 px-2">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 px-3">Tables</h2>
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  selectedTable.name === table.name ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {selectedTable.name === table.name ? (
                  <ChevronDown className="mr-3 h-5 w-5 text-indigo-500" aria-hidden="true" />
                ) : (
                  <ChevronRight className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                )}
                {table.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['Schema', 'Preview', 'Query'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'Schema' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Schema</h2>
                  <ul className="mt-4 space-y-4">
                    {selectedTable.schema.map((column) => (
                      <li key={column.name} className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{column.name}</span>
                        <span className="text-gray-500">{column.type}</span>
                        <span className="text-gray-500">{column.mode}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'Preview' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                  <table className="mt-4 w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        {Object.keys(selectedTable.data[0]).map((col) => (
                          <th key={col} className="px-4 py-2 border text-left text-sm font-medium text-gray-500">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable.data.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, idx) => (
                            <td key={idx} className="px-4 py-2 border text-sm text-gray-700">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'Query' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Run Query</h2>
                  <div className="mt-4 flex space-x-4">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="SELECT * FROM testData1"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                      onClick={runQuery}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm"
                    >
                      Run
                    </button>
                  </div>

                  {queryResult && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900">Query Result</h3>
                      <table className="mt-4 w-full table-auto border-collapse">
                        <thead>
                          <tr>
                            {Object.keys(queryResult[0]).map((col) => (
                              <th key={col} className="px-4 py-2 border text-left text-sm font-medium text-gray-500">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, idx) => (
                                <td key={idx} className="px-4 py-2 border text-sm text-gray-700">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
