"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { ArrowLeft, CreditCard, DollarSign, Calendar, Download, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"

// Services
import { paymentService } from "@/services/paymentService" // Adjust path
import { authService } from "@/services/authService"

export default function TenantPaymentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [payments, setPayments] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState("card")

  // 1. Fetch Data
  const loadPayments = async () => {
    try {
      setLoading(true)
      // Uses backend: PaymentModel.findByTenantUserId
      const data = await paymentService.getMyPayments()
      setPayments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load payment history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure user is logged in
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }
    loadPayments()
  }, [])

  // 2. Computed Data
  // Find the next unpaid bill (pending or late)
  const upcomingPayment = payments.find(p => p.status === 'pending' || p.status === 'late')

  // Filter history (completed payments)
  const paymentHistory = payments.filter(p => p.status === 'completed' || p.status === 'paid')

  // Calculate Stats
  const paymentStats = {
    totalPaid: paymentHistory.reduce((sum, p) => sum + Number(p.amount), 0),
    onTimePayments: paymentHistory.filter((p) => p.status === "completed" && new Date(p.payment_date) <= new Date(p.due_date)).length,
    averagePayment: paymentHistory.length > 0
      ? Math.round(paymentHistory.reduce((sum, p) => sum + Number(p.amount), 0) / paymentHistory.length)
      : 0,
  }

  // Days until due calculation
  let daysUntilDue = 0
  if (upcomingPayment) {
    const due = new Date(upcomingPayment.due_date).getTime()
    const now = new Date().getTime()
    daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  }

  // 3. Handle Payment Submission
  const handlePayNow = async () => {
    if (!upcomingPayment) return

    try {
      setProcessing(true)

      // Since we don't have a real gateway, we simulate a successful payment 
      // by updating the record status to 'completed'
      const payload = {
        ...upcomingPayment, // Keep existing IDs
        status: 'completed',
        payment_method: paymentMethod,
        payment_date: new Date().toISOString(), // Paid now
        notes: `Paid via Tenant Portal (${paymentMethod})`
      }

      await paymentService.update(upcomingPayment.id, payload)

      toast.success("Payment processed successfully!")
      setIsDialogOpen(false)
      loadPayments() // Refresh UI
    } catch (err) {
      console.error(err)
      toast.error("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  // Helper colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return "text-green-600 border-green-600 bg-green-50"
      case 'paid': return "text-green-600 border-green-600 bg-green-50"
      case 'pending': return "text-amber-600 border-amber-600 bg-amber-50"
      case 'late': return "text-red-600 border-red-600 bg-red-50"
      default: return "text-slate-600 border-slate-600"
    }
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/tenant">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Payment Center</h1>
                <p className="text-muted-foreground">Manage your rent payments and view history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* Upcoming Payment Alert */}
        {upcomingPayment ? (
          <Card className={`mb-8 ${daysUntilDue < 0 ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardContent>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`h-6 w-6 ${daysUntilDue < 0 ? 'text-red-600' : 'text-orange-600'}`} />
                  <div>
                    <h3 className={`font-semibold ${daysUntilDue < 0 ? 'text-red-800' : 'text-orange-800'}`}>
                      {daysUntilDue < 0
                        ? `Payment Overdue by ${Math.abs(daysUntilDue)} days`
                        : `Payment Due in ${daysUntilDue} days`}
                    </h3>
                    <p className={`text-sm ${daysUntilDue < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                      ${upcomingPayment.amount} rent due on {new Date(upcomingPayment.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className={daysUntilDue < 0 ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Make Payment</DialogTitle>
                      <DialogDescription>
                        Pay your rent securely online.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Summary Box */}
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Amount Due:</span>
                          <span className="text-2xl font-bold">${upcomingPayment.amount}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">Property:</span>
                          <span className="text-sm">{upcomingPayment.property_name} - Unit {upcomingPayment.unit_number}</span>
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank_transfer">Bank Transfer (ACH)</SelectItem>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mock Fields based on Selection */}
                        {paymentMethod === 'card' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label>Card Number</Label>
                              <Input placeholder="0000 0000 0000 0000" />
                            </div>
                            <div>
                              <Label>Expiry</Label>
                              <Input placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <Input placeholder="123" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handlePayNow}
                        disabled={processing}
                      >
                        {processing ? "Processing..." : `Pay $${upcomingPayment.amount}`}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">You're all caught up!</h3>
                <p className="text-sm text-green-600">No pending payments found.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Payments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.onTimePayments}</div>
              <p className="text-xs text-muted-foreground">Successful transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.averagePayment.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly average</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your complete payment record</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Rent Payment</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method?.replace('_', ' ') || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {payment.transaction_id || payment.id.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${payment.amount}</p>
                    <Badge variant="outline" className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {paymentHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payment history available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods (Static for now, but UI ready) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Saved Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods for faster checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ****5678</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Default</Badge>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}