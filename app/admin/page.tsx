/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const tables = [
  "address",
  "attendant",
  "company",
  "companyemployeeworksin",
  "consider",
  "employee",
  "employeeemployeetypetypeof",
  "employeerolehasrole",
  "employeetype",
  "event",
  "eventemployeeworksfor",
  "eventexpenditurehascost",
  "eventplaceon",
  "expenditure",
  "place",
  "placeaddresslocatedon",
  "role",
  "sale",
  "saleaddresssoldon",
  "saleconsiderevaluate",
  "ticket",
  "tickettype",
];

const AdminPage = () => {
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newRecord, setNewRecord] = useState({});

  const router = useRouter();

  useEffect(() => {
    const user: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    if (parsedUser?.role !== "Administrator") router.push("/");

    fetchData();
  }, [selectedTable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/${selectedTable}`);
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
    setLoading(false);
  };

  const handleInputChange = (e, field) => {
    setNewRecord({ ...newRecord, [field]: e.target.value });
  };

  const handleAddRecord = async () => {
    try {
      await axios.post(`/api/${selectedTable}`, newRecord);
      toast.success("Record added successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to add record");
    }
  };

  const handleUpdateRecord = async (id: number) => {
    try {
      await axios.put(`/api/${selectedTable}`, { id, ...newRecord });
      toast.success("Record updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update record");
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      await axios.delete(`/api/${selectedTable}`, { data: { id } });
      toast.success("Record deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th key={key} className="py-2 px-4 border-b">
                      {key}
                    </th>
                  ))}
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record: any) => (
                <tr key={record.id}>
                  {Object.keys(record).map((key) => (
                    <td key={key} className="py-2 px-4 border-b">
                      {record[key]}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleUpdateRecord(record.id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Add New Record</h2>
        {data.length > 0 &&
          Object.keys(data[0]).map((key) =>
            key !== "id" ? (
              <div key={key} className="mb-2">
                <label className="block text-sm font-bold mb-1">{key}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleInputChange(e, key)}
                />
              </div>
            ) : null
          )}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddRecord}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
