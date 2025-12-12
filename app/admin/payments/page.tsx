"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, DollarSign, AlertCircle, CheckCircle, Clock, Edit, Trash2 } from "lucide-react"
import { toast, Toaster } from "sonner"

// Services & Components
import { paymentService } from "@/services/paymentService"
import { PaymentDialog, PaymentFormValues } from "@/components/admin/payment-dialog"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)

  // ✅ Fetch Data
  const loadData = async () => {
    try {
      setLoading(true)
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getAll(),
        paymentService.getStats()
      ]);

      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
      setStats(statsData || {})
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ✅ Handle Save
  const handleSave = async (values: PaymentFormValues) => {
    try {
      const payload = {
        ...values,
        amount: Number(values.amount),
        late_fee: Number(values.late_fee || 0),
        // Dates usually need to be ISO strings or standard YYYY-MM-DD depending on backend config
        // Assuming backend handles standard string dates fine.
      }

      console.log("🚀 Payload:", payload);

      if (editingPayment && editingPayment.id) {
        await paymentService.update(editingPayment.id, payload)
        toast.success("Payment updated")
      } else {
        await paymentService.create(payload)
        toast.success("Payment recorded successfully")
      }
      setIsDialogOpen(false)
      setEditingPayment(null)
      loadData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to save payment")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    try {
      await paymentService.delete(id);
      toast.success("Payment deleted");
      loadData();
    } catch (err) {
      toast.error("Failed to delete payment");
    }
  }

  // Frontend Filtering
  const filteredPayments = payments.filter((payment) => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      payment.tenant_name?.toLowerCase().includes(searchStr) ||
      payment.property_name?.toLowerCase().includes(searchStr) ||
      payment.unit_number?.toLowerCase().includes(searchStr);

    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "paid": return "bg-green-100 text-green-800" // Fallback if backend uses 'paid'
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "late": return "bg-red-100 text-red-800"
      case "overdue": return "bg-red-100 text-red-800"
      case "failed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />
      case "pending": return <Clock className="w-4 h-4" />
      case "late": return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-slate-600 mt-1">Track rent payments and manage overdue accounts</p>
          </div>

          <PaymentDialog
            isOpen={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingPayment(null);
            }}
            onSave={handleSave}
            editingPayment={editingPayment}
          />

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => { setEditingPayment(null); setIsDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>

        {/* Stats Cards - Pulling from Backend Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Collected</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${Number(stats?.total_collected || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Outstanding/Late</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${Number(stats?.total_outstanding || 0).toLocaleString()}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats?.pending_count || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Late Fees</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${Number(stats?.total_late_fees || 0).toLocaleString()}
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
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
            {loading && <div className="text-center py-4">Loading payments...</div>}

            <div className="space-y-4">
              {!loading && filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">

                    {/* Column 1: Tenant */}
                    <div>
                      <p className="font-medium text-slate-900">{payment.tenant_name}</p>
                      <p className="text-sm text-slate-600">
                        {payment.property_name} - Unit {payment.unit_number}
                      </p>
                    </div>

                    {/* Column 2: Amount */}
                    <div>
                      <p className="text-lg font-bold text-slate-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">Rent (${payment.rent_amount})</p>
                    </div>

                    {/* Column 3: Dates */}
                    <div>
                      <p className="text-sm text-slate-600">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                      {payment.payment_date && (
                        <p className="text-sm text-slate-600">Paid: {new Date(payment.payment_date).toLocaleDateString()}</p>
                      )}
                    </div>

                    {/* Column 4: Status */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </div>
                        </Badge>
                      </div>
                      {Number(payment.late_fee) > 0 && (
                        <p className="text-xs text-red-600 mt-1">+${payment.late_fee} Late Fee</p>
                      )}
                    </div>

                    {/* Column 5: Method */}
                    <div>
                      {payment.payment_method && <p className="text-sm text-slate-600 capitalize">{payment.payment_method.replace('_', ' ')}</p>}
                      {payment.transaction_id && <p className="text-xs text-muted-foreground">Ref: {payment.transaction_id}</p>}
                    </div>

                    {/* Column 6: Actions */}
                    <div className="flex space-x-2 items-center">
                      <Button variant="outline" size="sm" onClick={() => { setEditingPayment(payment); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(payment.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                  </div>
                </div>
              ))}

              {!loading && filteredPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No payments found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}