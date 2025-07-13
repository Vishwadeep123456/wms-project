// pages/dashboard.js

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/dashboard");
      setSalesData(res.data.sales);
      setSummary(res.data.summary);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 WMS Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold">{summary.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold">₹ {summary.totalRevenue}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Unique SKUs</p>
              <p className="text-xl font-semibold">{summary.uniqueSkus}</p>
            </div>
          </div>

          {/* Table of Sales */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">SKU</th>
                  <th className="border p-2">MSKU</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{item.orderId}</td>
                    <td className="border p-2">{item.sku}</td>
                    <td className="border p-2">{item.msku}</td>
                    <td className="border p-2">{item.qty}</td>
                    <td className="border p-2">₹ {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
