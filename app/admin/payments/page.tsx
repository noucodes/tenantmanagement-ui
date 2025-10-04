"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react"

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    tenant: "Sarah Johnson",
    property: "Sunset Apartments",
    unit: "Unit 2A",
    amount: 1200,
    dueDate: "2024-02-01",
    paidDate: "2024-01-30",
    status: "paid",
    method: "Bank Transfer",
    late: false,
  },
  {
    id: 2,
    tenant: "Michael Chen",
    property: "Oak Ridge Complex",
    unit: "Unit 1B",
    amount: 1450,
    dueDate: "2024-02-01",
    paidDate: null,
    status: "overdue",
    method: null,
    late: true,
    daysOverdue: 15,
  },
  {
    id: 3,
    tenant: "Emily Rodriguez",
    property: "Downtown Lofts",
    unit: "Unit 3C",
    amount: 1800,
    dueDate: "2024-02-15",
    paidDate: null,
    status: "pending",
    method: null,
    late: false,
  },
  {
    id: 4,
    tenant: "David Wilson",
    property: "Sunset Apartments",
    unit: "Unit 1A",
    amount: 1100,
    dueDate: "2024-01-01",
    paidDate: "2024-01-05",
    status: "paid",
    method: "Credit Card",
    late: true,
    daysLate: 4,
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  const filteredPayments = payments.filter(
    (payment) =>
      payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.unit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleRecordPayment = () => {
    setIsRecordDialogOpen(false)
  }

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-slate-600 mt-1">Track rent payments and manage overdue accounts</p>
          </div>
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>Record a new rent payment</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="tenant">Tenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson - Unit 2A</SelectItem>
                      <SelectItem value="michael">Michael Chen - Unit 1B</SelectItem>
                      <SelectItem value="emily">Emily Rodriguez - Unit 3C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="Enter amount" />
                  </div>
                  <div>
                    <Label htmlFor="method">Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="card">Credit Card</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paidDate">Payment Date</Label>
                    <Input id="paidDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="forMonth">For Month</Label>
                    <Input id="forMonth" type="month" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input id="notes" placeholder="Add any notes about this payment" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment} className="bg-emerald-600 hover:bg-emerald-700">
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-amber-600">${pendingAmount.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Collection Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round((totalRevenue / (totalRevenue + overdueAmount + pendingAmount)) * 100)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search payments by tenant, property, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Track all rent payments and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{payment.tenant}</p>
                      <p className="text-sm text-slate-600">
                        {payment.property} - {payment.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">${payment.amount}</p>
                      <p className="text-sm text-slate-600">Monthly Rent</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Due: {payment.dueDate}</p>
                      {payment.paidDate && <p className="text-sm text-slate-600">Paid: {payment.paidDate}</p>}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                          </div>
                        </Badge>
                      </div>
                      {payment.late && payment.status === "overdue" && (
                        <p className="text-xs text-red-600 mt-1">{payment.daysOverdue} days overdue</p>
                      )}
                      {payment.late && payment.status === "paid" && (
                        <p className="text-xs text-amber-600 mt-1">Paid {payment.daysLate} days late</p>
                      )}
                    </div>
                    <div>{payment.method && <p className="text-sm text-slate-600">{payment.method}</p>}</div>
                    <div className="flex space-x-2">
                      {payment.status === "overdue" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          Record Payment
                        </Button>
                      )}
                      {payment.status === "overdue" && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
