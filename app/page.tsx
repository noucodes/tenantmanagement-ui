import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Wrench } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Property Management System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Streamline your property management with our comprehensive platform for landlords, tenants, and staff.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Admin/Landlord Card */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin / Landlord</CardTitle>
              <CardDescription>Manage properties, tenants, and finances with comprehensive admin tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Property & unit management</p>
                <p>• Tenant profiles & assignments</p>
                <p>• Lease management & renewals</p>
                <p>• Payment tracking & reports</p>
                <p>• Maintenance oversight</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login?role=admin">Login as Admin</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/register?role=admin">Register as Admin</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/admin">View Admin Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Card */}
          <Card className="border-2 hover:border-secondary/50 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-secondary/10 rounded-full w-fit">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Tenant</CardTitle>
              <CardDescription>
                Access your lease information, make payments, and submit maintenance requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• View lease details & terms</p>
                <p>• Payment history & online pay</p>
                <p>• Submit maintenance requests</p>
                <p>• Receive announcements</p>
                <p>• Update profile settings</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login?role=tenant">Login as Tenant</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/register?role=tenant">Register as Tenant</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/tenant">View Tenant Portal</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Staff Card */}
          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                <Wrench className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Staff</CardTitle>
              <CardDescription>Manage maintenance tasks and communicate with tenants and landlords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• View assigned tasks</p>
                <p>• Update maintenance status</p>
                <p>• Schedule appointments</p>
                <p>• Communicate with tenants</p>
                <p>• Track work progress</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login?role=staff">Login as Staff</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/register?role=staff">Register as Staff</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/staff">View Staff Interface</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
