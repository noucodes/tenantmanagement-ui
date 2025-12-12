"use client"

import { useState, useEffect } from "react"
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
  Legend
} from "recharts"
import { Download, DollarSign, Home, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { toast, Toaster } from "sonner"

// Services
import { reportService } from "@/services/reportService"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(new Date().getFullYear().toString()) // Default to current year

  // State for all report data
  const [revenueStats, setRevenueStats] = useState<any>(null)
  const [occupancyStats, setOccupancyStats] = useState<any>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [propertyPerformance, setPropertyPerformance] = useState<any[]>([])
  const [paymentTrends, setPaymentTrends] = useState<any[]>([])

  const loadReports = async () => {
    try {
      setLoading(true)
      const currentYear = Number(period);

      // Calculate start/end dates for the revenue summary (Full Year)
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      // 🚀 Parallel Data Fetching
      const [
        revStats,
        occStats,
        monthlyRevData,
        propPerfData,
        payTrendsData
      ] = await Promise.all([
        reportService.getRevenue(startDate, endDate),
        reportService.getOccupancy(),
        reportService.getMonthlyRevenue(currentYear),
        reportService.getPropertyPerformance(),
        reportService.getPaymentTrends(6) // Last 6 months trends
      ]);

      setRevenueStats(revStats)
      setOccupancyStats(occStats)
      setMonthlyRevenue(Array.isArray(monthlyRevData) ? monthlyRevData : [])
      setPropertyPerformance(Array.isArray(propPerfData) ? propPerfData : [])
      setPaymentTrends(Array.isArray(payTrendsData) ? payTrendsData : [])

    } catch (err) {
      console.error(err)
      toast.error("Failed to load report data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [period])

  const handleExportReport = () => {
    toast.success("Report export started (Demo)")
    // Implementation: You would typically hit a backend endpoint that generates a PDF/CSV here
  }

  // Format Helpers
  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val || 0));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-600 mt-1">Real-time property performance insights</p>
          </div>
          <div className="flex space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue (YTD)</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {loading ? "..." : formatCurrency(revenueStats?.total_revenue)}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                    {revenueStats?.completed_transactions || 0} Transactions
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
                  <p className="text-sm font-medium text-slate-600">Pending / Late</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {loading ? "..." : formatCurrency(revenueStats?.pending_revenue)}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <AlertCircle className="w-3 h-3 mr-1 text-amber-500" />
                    {revenueStats?.total_late_fees > 0
                      ? `Inc. ${formatCurrency(revenueStats?.total_late_fees)} fees`
                      : "Outstanding"}
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loading ? "..." : `${occupancyStats?.occupancy_rate || 0}%`}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    {occupancyStats?.occupied_units || 0} / {occupancyStats?.total_units || 0} Units
                  </div>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Vacant Units</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loading ? "..." : occupancyStats?.vacant_units || 0}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Availability
                  </div>
                </div>
                <Home className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Income breakdown for {period}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month_name" tickFormatter={(val) => val.substring(0, 3)} />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Payment Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Activity (6 Months)</CardTitle>
              <CardDescription>Completed vs Late payments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={paymentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="On Time" />
                    <Line type="monotone" dataKey="late" stroke="#ef4444" strokeWidth={2} name="Late" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Property Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Revenue and occupancy by property</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading performance data...</div>
            ) : (
              <div className="space-y-4">
                {propertyPerformance.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-slate-900">{property.name}</h4>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-1 text-sm text-slate-600">
                        <span>{property.city}, {property.state}</span>
                        <span className="hidden md:inline">•</span>
                        <span>{property.total_units} Units</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(property.actual_revenue)}
                      </span>
                      <Badge variant={Number(property.occupancy_rate) > 90 ? "default" : "secondary"}>
                        {property.occupancy_rate}% Occupied
                      </Badge>
                    </div>
                  </div>
                ))}

                {propertyPerformance.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">No property data available.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}