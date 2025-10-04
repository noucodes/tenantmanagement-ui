"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, DollarSign, Home, Wrench, TrendingUp, TrendingDown } from "lucide-react"

// Mock data for reports
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 12000 },
  { month: "Feb", revenue: 47000, expenses: 13500 },
  { month: "Mar", revenue: 48500, expenses: 11000 },
  { month: "Apr", revenue: 46000, expenses: 14000 },
  { month: "May", revenue: 49000, expenses: 12500 },
  { month: "Jun", revenue: 51000, expenses: 13000 },
]

const occupancyData = [
  { month: "Jan", occupied: 85, vacant: 15 },
  { month: "Feb", occupied: 88, vacant: 12 },
  { month: "Mar", occupied: 92, vacant: 8 },
  { month: "Apr", occupied: 90, vacant: 10 },
  { month: "May", occupied: 94, vacant: 6 },
  { month: "Jun", occupied: 96, vacant: 4 },
]

const maintenanceData = [
  { category: "Plumbing", count: 15, cost: 3500 },
  { category: "Electrical", count: 8, cost: 2200 },
  { category: "HVAC", count: 12, cost: 5400 },
  { category: "General", count: 20, cost: 1800 },
  { category: "Appliances", count: 6, cost: 2100 },
]

const propertyPerformance = [
  { property: "Sunset Apartments", revenue: 18000, occupancy: 95, maintenance: 2500 },
  { property: "Oak Ridge Complex", revenue: 22000, occupancy: 92, maintenance: 3200 },
  { property: "Downtown Lofts", revenue: 28000, occupancy: 98, maintenance: 1800 },
  { property: "Garden View", revenue: 15000, occupancy: 88, maintenance: 4100 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedReport, setSelectedReport] = useState("overview")

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0)
  const netIncome = totalRevenue - totalExpenses
  const avgOccupancy = occupancyData.reduce((sum, item) => sum + item.occupied, 0) / occupancyData.length

  const handleExportReport = () => {
    // Export logic here
    console.log("Exporting report...")
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-600 mt-1">Comprehensive property management insights</p>
          </div>
          <div className="flex space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Button
                variant={selectedReport === "overview" ? "default" : "outline"}
                onClick={() => setSelectedReport("overview")}
              >
                Overview
              </Button>
              <Button
                variant={selectedReport === "financial" ? "default" : "outline"}
                onClick={() => setSelectedReport("financial")}
              >
                Financial
              </Button>
              <Button
                variant={selectedReport === "occupancy" ? "default" : "outline"}
                onClick={() => setSelectedReport("occupancy")}
              >
                Occupancy
              </Button>
              <Button
                variant={selectedReport === "maintenance" ? "default" : "outline"}
                onClick={() => setSelectedReport("maintenance")}
              >
                Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-sm text-emerald-600">+8.2%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Net Income</p>
                  <p className="text-2xl font-bold text-slate-900">${netIncome.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-sm text-emerald-600">+12.5%</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Occupancy</p>
                  <p className="text-2xl font-bold text-slate-900">{avgOccupancy.toFixed(1)}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                    <span className="text-sm text-emerald-600">+3.1%</span>
                  </div>
                </div>
                <Home className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Maintenance Costs</p>
                  <p className="text-2xl font-bold text-slate-900">${totalExpenses.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">-5.3%</span>
                  </div>
                </div>
                <Wrench className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Monthly occupancy trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="occupied" stroke="#10b981" strokeWidth={3} name="Occupied %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance by Category</CardTitle>
              <CardDescription>Distribution of maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maintenanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {maintenanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Property Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
              <CardDescription>Revenue and occupancy by property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyPerformance.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">{property.property}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-600">Revenue: ${property.revenue.toLocaleString()}</span>
                        <Badge variant="outline">{property.occupancy}% occupied</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Maintenance</p>
                      <p className="font-medium">${property.maintenance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>Detailed monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Month</th>
                    <th className="text-right p-2">Revenue</th>
                    <th className="text-right p-2">Expenses</th>
                    <th className="text-right p-2">Net Income</th>
                    <th className="text-right p-2">Occupancy</th>
                    <th className="text-right p-2">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((item, index) => {
                    const netIncome = item.revenue - item.expenses
                    const margin = ((netIncome / item.revenue) * 100).toFixed(1)
                    const occupancy = occupancyData[index]?.occupied || 0

                    return (
                      <tr key={item.month} className="border-b hover:bg-slate-50">
                        <td className="p-2 font-medium">{item.month}</td>
                        <td className="p-2 text-right text-emerald-600">${item.revenue.toLocaleString()}</td>
                        <td className="p-2 text-right text-red-600">${item.expenses.toLocaleString()}</td>
                        <td className="p-2 text-right font-medium">${netIncome.toLocaleString()}</td>
                        <td className="p-2 text-right">{occupancy}%</td>
                        <td className="p-2 text-right">{margin}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
