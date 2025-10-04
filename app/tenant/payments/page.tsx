import Link from "next/link"
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
} from "@/components/ui/dialog"
import { ArrowLeft, CreditCard, DollarSign, Calendar, Download, AlertCircle, CheckCircle } from "lucide-react"

export default function PaymentsPage() {
  // Mock payment data
  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-01",
      amount: 1500,
      type: "Rent",
      status: "paid",
      method: "Bank Transfer",
      confirmationNumber: "TXN-2024-001",
    },
    {
      id: 2,
      date: "2023-12-01",
      amount: 1500,
      type: "Rent",
      status: "paid",
      method: "Credit Card",
      confirmationNumber: "TXN-2023-012",
    },
    {
      id: 3,
      date: "2023-11-01",
      amount: 1500,
      type: "Rent",
      status: "paid",
      method: "Bank Transfer",
      confirmationNumber: "TXN-2023-011",
    },
    {
      id: 4,
      date: "2023-10-01",
      amount: 1500,
      type: "Rent",
      status: "paid",
      method: "Credit Card",
      confirmationNumber: "TXN-2023-010",
    },
    {
      id: 5,
      date: "2023-09-15",
      amount: 300,
      type: "Pet Deposit",
      status: "paid",
      method: "Bank Transfer",
      confirmationNumber: "TXN-2023-009",
    },
  ]

  const upcomingPayment = {
    amount: 1500,
    dueDate: "2024-02-01",
    type: "Monthly Rent",
    daysUntilDue: 5,
  }

  const paymentStats = {
    totalPaid: paymentHistory.reduce((sum, payment) => sum + payment.amount, 0),
    onTimePayments: paymentHistory.filter((p) => p.status === "paid").length,
    averagePayment: Math.round(
      paymentHistory.reduce((sum, payment) => sum + payment.amount, 0) / paymentHistory.length,
    ),
  }

  return (
    <div className="min-h-screen bg-background">
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
        {upcomingPayment.daysUntilDue <= 7 && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      Payment Due in {upcomingPayment.daysUntilDue} days
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      ${upcomingPayment.amount} {upcomingPayment.type} due on{" "}
                      {new Date(upcomingPayment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Make Payment</DialogTitle>
                      <DialogDescription>
                        Pay your rent securely online. Your payment will be processed immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Amount Due:</span>
                          <span className="text-2xl font-bold">${upcomingPayment.amount}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">Due Date:</span>
                          <span className="text-sm">{new Date(upcomingPayment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank">Bank Transfer (ACH)</SelectItem>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input id="zipCode" placeholder="12345" />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Cancel
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          Pay ${upcomingPayment.amount}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
              <p className="text-xs text-muted-foreground">Perfect payment record</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentStats.averagePayment}</div>
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
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • {payment.method}
                      </p>
                      <p className="text-xs text-muted-foreground">Confirmation: {payment.confirmationNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${payment.amount}</p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Paid
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
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
                    <p className="font-medium">Bank Account ****1234</p>
                    <p className="text-sm text-muted-foreground">Primary payment method</p>
                  </div>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ****5678</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
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
