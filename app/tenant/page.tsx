import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, DollarSign, Wrench, Bell, Settings, Home, CreditCard, AlertCircle } from "lucide-react"

export default function TenantDashboard() {
  // Mock data
  const tenantInfo = {
    name: "John Doe",
    unit: "Sunset Apartments - Unit 2A",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    rentAmount: 1500,
    rentDue: "2024-02-01",
    daysUntilDue: 5,
  }

  const recentPayments = [
    { id: 1, date: "2024-01-01", amount: 1500, status: "paid", method: "Bank Transfer" },
    { id: 2, date: "2023-12-01", amount: 1500, status: "paid", method: "Credit Card" },
    { id: 3, date: "2023-11-01", amount: 1500, status: "paid", method: "Bank Transfer" },
  ]

  const maintenanceRequests = [
    { id: 1, title: "Leaky faucet in kitchen", status: "in-progress", date: "2024-01-15", priority: "medium" },
    { id: 2, title: "Broken light fixture", status: "completed", date: "2024-01-10", priority: "low" },
    { id: 3, title: "Heating not working", status: "pending", date: "2024-01-20", priority: "high" },
  ]

  const announcements = [
    { id: 1, title: "Building maintenance scheduled", date: "2024-01-25", type: "maintenance" },
    { id: 2, title: "New parking regulations", date: "2024-01-20", type: "policy" },
    { id: 3, title: "Holiday office hours", date: "2024-01-18", type: "general" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="text-2xl font-bold">Tenant Portal</h1>
                <p className="text-muted-foreground">Welcome back, {tenantInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="destructive">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Rent Due Alert */}
        {tenantInfo.daysUntilDue <= 7 && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    Rent Due in {tenantInfo.daysUntilDue} days
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    ${tenantInfo.rentAmount} due on {new Date(tenantInfo.rentDue).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${tenantInfo.rentAmount}</div>
              <p className="text-xs text-muted-foreground">Due {new Date(tenantInfo.rentDue).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Until {new Date(tenantInfo.leaseEnd).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {maintenanceRequests.filter((r) => r.status !== "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Active requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tenant tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/tenant/payments">
                  <CreditCard className="h-6 w-6" />
                  <span>Pay Rent</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/tenant/maintenance">
                  <Wrench className="h-6 w-6" />
                  <span>Request Maintenance</span>
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
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/tenant/profile">
                  <Settings className="h-6 w-6" />
                  <span>Profile Settings</span>
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
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Recent Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • {payment.method}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Paid
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/tenant/payments">View All Payments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                <span>Maintenance Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(request.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          request.priority === "high"
                            ? "destructive"
                            : request.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {request.priority}
                      </Badge>
                      <Badge
                        variant={
                          request.status === "completed"
                            ? "outline"
                            : request.status === "in-progress"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/tenant/maintenance">View All Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lease Information */}
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
                  <p className="text-lg font-semibold">{tenantInfo.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lease Term</p>
                  <p className="text-lg font-semibold">
                    {new Date(tenantInfo.leaseStart).toLocaleDateString()} -{" "}
                    {new Date(tenantInfo.leaseEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                  <p className="text-lg font-semibold">${tenantInfo.rentAmount}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Lease Progress</p>
                  <Progress value={75} className="mb-2" />
                  <p className="text-sm text-muted-foreground">75% complete (9 months remaining)</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/tenant/lease">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Lease Agreement
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="mt-8">
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
                    {announcement.type === "maintenance" && <Wrench className="h-4 w-4 text-orange-500" />}
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
    </div>
  )
}
