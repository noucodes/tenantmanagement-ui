"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  ArrowUpRight,
  Loader2,
  CheckCircle,
  Clock
} from "lucide-react"
import { toast, Toaster } from "sonner"

// Service
import { dashboardService } from "@/services/dashboardService"
import { authService } from "@/services/authService"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Load User
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Load Dashboard Data
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getAdminDashboard();
        setData(dashboardData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Helper to format currency
  const formatCurrency = (val: any) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val || 0));

  // Calculate Occupancy Rate safely
  const totalUnits = Number(data?.units?.total || 0);
  const occupiedUnits = Number(data?.units?.occupied || 0);
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.first_name || 'Admin'}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/admin/leases">
            <Plus className="h-4 w-4" />
            Quick Lease
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Properties Stats */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.properties?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.units?.total || 0} Total Units
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Stats */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedUnits} Occupied / {data?.units?.vacant || 0} Vacant
            </p>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(data?.payments?.collected)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.payments?.completed_count || 0} payments received
            </p>
          </CardContent>
        </Card>

        {/* Outstanding Stats */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(data?.payments?.outstanding)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.payments?.outstanding_count || 0} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alerts & Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* 1. Overdue Payments Alert */}
            {data?.overduePayments?.length > 0 ? (
              <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div>
                  <p className="font-medium text-destructive">
                    {data.overduePayments.length} Overdue Payments
                  </p>
                  <p className="text-sm text-muted-foreground">Totaling {formatCurrency(data.payments.outstanding)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Urgent</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/admin/payments">
                      View <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">All payments are up to date!</p>
              </div>
            )}

            {/* 2. Expiring Leases Alert */}
            {data?.expiringLeases?.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <p className="font-medium text-amber-800">
                    {data.expiringLeases.length} Leases Expiring Soon
                  </p>
                  <p className="text-sm text-amber-600/80">Within the next 30 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-amber-700 border-amber-300">Action Needed</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/admin/leases">
                      Review <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {data?.expiringLeases?.length === 0 && data?.overduePayments?.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No urgent alerts.</div>
            )}

          </CardContent>
        </Card>

        {/* Recent Activity (Payments) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentPayments?.length > 0 ? (
                data.recentPayments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Payment received from {payment.tenant_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.property_name} - Unit {payment.unit_number} • {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to common management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/5 bg-transparent">
              <Link href="/admin/properties">
                <Building2 className="h-6 w-6 text-primary" />
                <span>Properties</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2 hover:bg-secondary/5 bg-transparent">
              <Link href="/admin/tenants">
                <Users className="h-6 w-6 text-blue-600" />
                <span>Tenants</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2 hover:bg-accent/5 bg-transparent">
              <Link href="/admin/leases">
                <FileText className="h-6 w-6 text-orange-600" />
                <span>Leases</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-950/20 bg-transparent"
            >
              <Link href="/admin/payments">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span>Payments</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}