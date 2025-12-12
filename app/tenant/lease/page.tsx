"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, FileText, Download, Calendar, DollarSign, Home, User, Clock, Loader2, MapPin, PhilippinePeso } from "lucide-react"
import { toast, Toaster } from "sonner"

// Services
import { leaseService } from "@/services/leaseService"
import { authService } from "@/services/authService"

export default function LeaseInfoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [lease, setLease] = useState<any>(null)

  useEffect(() => {
    // 1. Check Auth
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    console.log("Current User:", currentUser)

    // 2. Fetch Active Lease
    const fetchLease = async () => {
      try {
        setLoading(true)
        const data = await leaseService.getMyLease()
        setLease(data)
      } catch (error) {
        console.error("Error fetching lease:", error)
        toast.error("Failed to load lease information")
      } finally {
        setLoading(false)
      }
    }

    fetchLease()
  }, [])

  const handleDownload = () => {
    toast.success("Downloading Lease PDF... (Feature pending backend implementation)")
  }

  // Helper: Calculate Dates & Progress
  const getLeaseMetrics = () => {
    if (!lease) return { progress: 0, remainingDays: 0, totalDays: 0 };

    const start = new Date(lease.start_date).getTime()
    const end = new Date(lease.end_date).getTime()
    const current = new Date().getTime()

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((current - start) / (1000 * 60 * 60 * 24))
    const remainingDays = Math.max(0, Math.ceil((end - current) / (1000 * 60 * 60 * 24)))

    // Calculate progress percentage (0 to 100)
    const progress = totalDays > 0 ? Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100)) : 0

    return { progress, remainingDays, totalDays }
  }

  const { progress, remainingDays } = getLeaseMetrics()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!lease) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Active Lease</CardTitle>
            <CardDescription>We couldn't find an active lease associated with your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/tenant">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
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
              <Button asChild variant="ghost">
                <Link href="/tenant">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Lease Agreement</h1>
                <p className="text-muted-foreground">View your lease terms and contract details</p>
              </div>
            </div>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* Lease Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Lease Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Start: {new Date(lease.start_date).toLocaleDateString()}</span>
                <span>End: {new Date(lease.end_date).toLocaleDateString()}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(progress)}% complete</span>
                <span>{remainingDays} days remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Property Name</p>
                <p className="text-lg font-semibold">{lease.property_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unit</p>
                <p className="text-lg font-semibold">{lease.unit_number}</p>
                <Badge variant="outline" className="mt-1">
                  {lease.bedrooms} Bed / {lease.bathrooms} Bath
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <div className="flex items-start mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground mt-1" />
                  <p className="text-base">
                    {lease.address}
                    {lease.city}, {lease.state} {lease.zip_code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Parties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tenant</p>
                <p className="text-lg font-semibold">{user?.name || user?.first_name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Landlord / Management</p>
                <p className="text-lg font-semibold">Admin Management Team</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lease Status</p>
                <Badge className="mt-1 capitalize bg-green-100 text-green-800 hover:bg-green-100">
                  {lease.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PhilippinePeso className="h-5 w-5" />
              <span>Financial Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Rent</p>
                <p className="text-2xl font-bold text-primary">₱{Number(lease.rent_amount).toLocaleString()}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Security Deposit</p>
                <p className="text-2xl font-bold">₱{Number(lease.security_deposit).toLocaleString()}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Payment Day</p>
                <p className="text-2xl font-bold">Day {lease.payment_day || 1}</p>
                <p className="text-xs text-muted-foreground">of every month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions (From DB 'terms' field) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Terms & Notes</CardTitle>
            <CardDescription>Specific conditions applied to this lease</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lease.terms ? (
                <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                  {lease.terms}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No additional custom terms specified.</p>
              )}

              {lease.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{lease.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}