"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, DollarSign, Bell, Settings, Home, CreditCard, AlertCircle, Loader2, CheckCircle, PhilippinePeso } from "lucide-react"
import { ButtonLogout } from "@/components/tenant/logout" // Assuming you have this component
import { toast, Toaster } from "sonner"

// Services
import { dashboardService } from "@/services/dashboardService" // Adjust path if needed
import { authService } from "@/services/authService"

export default function TenantDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  // Mock announcements (Since backend doesn't support this yet)
  const announcements = [
    { id: 1, title: "Building Maintenance", date: "2024-03-20", type: "general" },
    { id: 2, title: "New Parking Policy", date: "2024-03-15", type: "policy" },
  ]

  useEffect(() => {
    // 1. Get Logged In User
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // 2. Fetch Dashboard Data
    const loadDashboard = async () => {
      try {
        setLoading(true)
        // This endpoint returns: { tenant, activeLease, recentPayments, upcomingPayments }
        const result = await dashboardService.getTenantDashboard()
        setData(result)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  // --- Logic Helpers ---

  // Helper: Format Currency
  const formatCurrency = (val: any) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(val || 0))

  // Helper: Calculate Lease Progress
  const calculateLeaseProgress = () => {
    if (!data?.activeLease) return 0;
    const start = new Date(data.activeLease.start_date).getTime();
    const end = new Date(data.activeLease.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(percent);
  }

  // Helper: Get Next Payment Info
  const getNextPaymentInfo = () => {
    const nextPayment = data?.upcomingPayments?.[0]; // Get the first pending/late payment
    if (!nextPayment) return null;

    const dueDate = new Date(nextPayment.due_date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      amount: nextPayment.amount,
      date: nextPayment.due_date,
      days: daysUntilDue
    };
  }

  const nextPayment = getNextPaymentInfo();
  const leaseProgress = calculateLeaseProgress();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold">Tenant Portal</h1>
                <p className="text-muted-foreground">
                  Welcome back, {data?.tenant?.first_name || user?.name || 'Tenant'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ButtonLogout />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* Rent Due Alert (Only shows if there is an upcoming payment pending/late) */}
        {nextPayment && (
          <Card className={`mb-6 ${nextPayment.days < 0 ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardContent>
              <div className="flex items-center space-x-3">
                <AlertCircle className={`h-5 w-5 ${nextPayment.days < 0 ? 'text-red-600' : 'text-orange-600'}`} />
                <div>
                  <p className={`font-medium ${nextPayment.days < 0 ? 'text-red-800' : 'text-orange-800'}`}>
                    {nextPayment.days < 0
                      ? `Rent Overdue by ${Math.abs(nextPayment.days)} days`
                      : `Rent Due in ${nextPayment.days} days`}
                  </p>
                  <p className={`text-sm ${nextPayment.days < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {formatCurrency(nextPayment.amount)} due on {new Date(nextPayment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" className={nextPayment.days < 0 ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"} asChild>
                    <Link href="/tenant/payments">Pay Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Active Lease State */}
        {!data?.activeLease && (
          <Card className="mb-8 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Active Lease Found</h3>
              <p className="text-muted-foreground">Contact property management if this is an error.</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats - Only show if lease exists */}
        {data?.activeLease && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rent</CardTitle>
                <PhilippinePeso className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.activeLease.rent_amount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unit {data.activeLease.unit_number} - {data.activeLease.property_name}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 capitalize">
                  {data.activeLease.status}
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(data.activeLease.end_date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tenant tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/tenant/payments">
                  <CreditCard className="h-6 w-6" />
                  <span>View Rent</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/tenant/lease">
                  <FileText className="h-6 w-6" />
                  <span>View Lease</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PhilippinePeso className="h-5 w-5 text-green-600" />
                <span>Recent Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentPayments?.length > 0 ? (
                  data.recentPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method?.replace('_', ' ') || 'N/A'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600 capitalize">
                        {payment.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent payments found.</p>
                )}

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/tenant/payments">View All Payments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Announcements (Static for now) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0 mt-1">
                      {announcement.type === "policy" && <FileText className="h-4 w-4 text-blue-500" />}
                      {announcement.type === "general" && <Bell className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(announcement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lease Information - Footer Section */}
        {data?.activeLease && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Lease Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Property & Unit</p>
                    <p className="text-lg font-semibold">
                      {data.activeLease.property_name} - Unit {data.activeLease.unit_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lease Term</p>
                    <p className="text-lg font-semibold">
                      {new Date(data.activeLease.start_date).toLocaleDateString()} -{" "}
                      {new Date(data.activeLease.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                    <p className="text-lg font-semibold">{formatCurrency(data.activeLease.rent_amount)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Lease Progress</p>
                    <Progress value={leaseProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{leaseProgress}% complete</p>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/tenant/lease">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Lease Agreement
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}