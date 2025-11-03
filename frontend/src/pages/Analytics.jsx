import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

import Loader from "../components/Loader";

export default function Analytics() {
 
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get("/analytics/summary");
        if (
          res.data &&
          res.data.totalNotes !== undefined &&
          Array.isArray(res.data.notesLast7Days)
        ) {
          setAnalytics(res.data);
        } else {
          setError("Invalid response structure from backend");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 sm:p-10">
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center text-lg mt-10">{error}</p>
      ) : analytics ? (
        <div className="space-y-10 mx-auto">
          {/* Header */}
          <header className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
              <BarChart3 className="w-9 h-9 text-indigo-600" /> Analytics Dashboard
            </h1>
            <p className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Insights into your note-taking habits
            </p>
          </header>

          {/*Total Notes */}
          <section className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" /> Total Notes Created
            </h2>
            <p className="text-6xl font-extrabold text-indigo-700 mt-3 tracking-wide drop-shadow-sm">
              {analytics.totalNotes ?? 0}
            </p>
          </section>

          {/*Notes Created (Last 7 Days) */}
          <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" /> Notes Created (Last 7 Days)
            </h2>

            {Array.isArray(analytics.notesLast7Days) &&
            analytics.notesLast7Days.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analytics.notesLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    tick={{ fill: "#4B5563", fontSize: 14 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: "#4B5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 6, stroke: "#4F46E5", fill: "white", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center italic">
                No notes found in the last 7 days.
              </p>
            )}
          </section>

          {/*Most Used Tags */}
          <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <PieChartIcon className="w-6 h-6 text-green-600" /> Most Used Tags (Top 3)
            </h2>

            {Array.isArray(analytics.topTags) && analytics.topTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Pie Chart */}
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.topTags}
                        dataKey="count"
                        nameKey="tag"
                        outerRadius={100}
                        label={({ name }) => `#${name}`}
                        labelLine={false}
                      >
                        {analytics.topTags.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topTags}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="tag"
                        tick={{ fill: "#4B5563", fontSize: 14 }}
                      />
                      <YAxis allowDecimals={false} tick={{ fill: "#4B5563" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Bar dataKey="count" fill="#4F46E5" barSize={50} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center italic">
                No tags found for your notes.
              </p>
            )}
          </section>
        </div>
      ) : (
        <p className="text-gray-500 text-center italic mt-10">
          No analytics data available.
        </p>
      )}
    </div>
  );
}
