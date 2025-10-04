import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, FileText, Download, Calendar, DollarSign, Home, User, Clock } from "lucide-react"

export default function LeaseInfoPage() {
  // Mock lease data
  const leaseInfo = {
    property: "Sunset Apartments",
    unit: "Unit 2A",
    tenant: "John Doe",
    landlord: "Property Management LLC",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    monthlyRent: 1500,
    securityDeposit: 1500,
    petDeposit: 300,
    leaseType: "Fixed Term",
    renewalOption: true,
    noticePeriod: 30,
    lateFeePeriod: 5,
    lateFeeAmount: 50,
    utilities: ["Water", "Sewer", "Trash"],
    restrictions: ["No smoking", "No pets over 50lbs", "Quiet hours 10PM-8AM"],
    amenities: ["Pool", "Gym", "Parking", "Laundry"],
    emergencyContact: "(555) 999-0000",
  }

  const currentDate = new Date()
  const startDate = new Date(leaseInfo.leaseStart)
  const endDate = new Date(leaseInfo.leaseEnd)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const elapsedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.min((elapsedDays / totalDays) * 100, 100)
  const remainingDays = Math.max(totalDays - elapsedDays, 0)

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
                <h1 className="text-2xl font-bold">Lease Agreement</h1>
                <p className="text-muted-foreground">View your lease terms and contract details</p>
              </div>
            </div>
            <Button>
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
                <span>Start: {new Date(leaseInfo.leaseStart).toLocaleDateString()}</span>
                <span>End: {new Date(leaseInfo.leaseEnd).toLocaleDateString()}</span>
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
                <p className="text-sm font-medium text-muted-foreground">Property</p>
                <p className="text-lg font-semibold">{leaseInfo.property}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unit</p>
                <p className="text-lg font-semibold">{leaseInfo.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lease Type</p>
                <p className="text-lg font-semibold">{leaseInfo.leaseType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="text-lg font-semibold">{leaseInfo.emergencyContact}</p>
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
                <p className="text-lg font-semibold">{leaseInfo.tenant}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Landlord</p>
                <p className="text-lg font-semibold">{leaseInfo.landlord}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lease Term</p>
                <p className="text-lg font-semibold">
                  {new Date(leaseInfo.leaseStart).toLocaleDateString()} -{" "}
                  {new Date(leaseInfo.leaseEnd).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Renewal Option</p>
                <Badge variant={leaseInfo.renewalOption ? "default" : "secondary"}>
                  {leaseInfo.renewalOption ? "Available" : "Not Available"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Rent</p>
                <p className="text-2xl font-bold text-primary">${leaseInfo.monthlyRent}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Security Deposit</p>
                <p className="text-2xl font-bold">${leaseInfo.securityDeposit}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Pet Deposit</p>
                <p className="text-2xl font-bold">${leaseInfo.petDeposit}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Late Fee Policy</p>
                <p className="text-sm">
                  ${leaseInfo.lateFeeAmount} after {leaseInfo.lateFeePeriod} days past due date
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notice Period</p>
                <p className="text-sm">{leaseInfo.noticePeriod} days written notice required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Included Utilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaseInfo.utilities.map((utility, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{utility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaseInfo.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restrictions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lease Restrictions</CardTitle>
            <CardDescription>Important rules and restrictions for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaseInfo.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span className="text-sm">{restriction}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lease Actions</CardTitle>
            <CardDescription>Common lease-related actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <FileText className="h-6 w-6" />
                <span>Request Lease Amendment</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span>Schedule Renewal Discussion</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Download className="h-6 w-6" />
                <span>Download Full Contract</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
