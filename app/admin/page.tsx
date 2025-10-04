import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  ArrowUpRight,
} from "lucide-react"

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalProperties: 12,
    totalUnits: 48,
    occupiedUnits: 42,
    vacantUnits: 6,
    totalTenants: 42,
    unpaidRent: 8,
    maintenanceRequests: 15,
    pendingRequests: 7,
    monthlyRevenue: 125000,
    occupancyRate: 87.5,
  }

  const recentActivity = [
    { id: 1, type: "payment", message: "Rent payment received from John Doe - Unit 2A", time: "2 hours ago" },
    { id: 2, type: "maintenance", message: "New maintenance request: Leaky faucet - Unit 5B", time: "4 hours ago" },
    { id: 3, type: "lease", message: "Lease renewal signed by Sarah Smith - Unit 3C", time: "1 day ago" },
    { id: 4, type: "tenant", message: "New tenant application received for Unit 1D", time: "2 days ago" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
          <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{stats.totalUnits} total units</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedUnits} of {stats.totalUnits} units occupied
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.unpaidRent} unpaid rent notices</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenanceRequests}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingRequests} pending requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div>
                <p className="font-medium text-destructive">8 Unpaid Rent Notices</p>
                <p className="text-sm text-muted-foreground">Requires immediate attention</p>
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
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-400">7 Pending Maintenance</p>
                <p className="text-sm text-muted-foreground">Awaiting staff assignment</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Action Needed</Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/maintenance">
                    Assign <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div>
                <p className="font-medium">3 Lease Expirations</p>
                <p className="text-sm text-muted-foreground">Expiring within 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Upcoming</Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/leases">
                    Review <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "payment" && <DollarSign className="h-4 w-4 text-green-500" />}
                    {activity.type === "maintenance" && <Wrench className="h-4 w-4 text-orange-500" />}
                    {activity.type === "lease" && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.type === "tenant" && <Users className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
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
            <Button asChild variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5 bg-transparent">
              <Link href="/admin/properties">
                <Building2 className="h-6 w-6" />
                <span>Add Property</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 hover:bg-secondary/5 bg-transparent">
              <Link href="/admin/tenants">
                <Users className="h-6 w-6" />
                <span>New Tenant</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2 hover:bg-accent/5 bg-transparent">
              <Link href="/admin/leases">
                <FileText className="h-6 w-6" />
                <span>Create Lease</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-950/20 bg-transparent"
            >
              <Link href="/admin/payments">
                <DollarSign className="h-6 w-6" />
                <span>Record Payment</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
