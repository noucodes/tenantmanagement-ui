import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Bell, Shield, Camera, Wrench, Clock } from "lucide-react"

export default function StaffProfilePage() {
  // Mock staff data
  const staffProfile = {
    name: "Mike Johnson",
    email: "mike.johnson@propertymanagement.com",
    phone: "(555) 123-4567",
    role: "Maintenance Technician",
    department: "Maintenance",
    employeeId: "EMP-2024-001",
    hireDate: "2023-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
    skills: ["Plumbing", "Electrical", "HVAC", "General Maintenance"],
    certifications: ["EPA 608 Certified", "OSHA 10-Hour", "Electrical License"],
    notifications: {
      email: true,
      sms: true,
      taskAssignments: true,
      emergencyAlerts: true,
      scheduleChanges: true,
    },
    workSchedule: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "On-call",
      sunday: "Off",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/staff">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Staff Profile</h1>
              <p className="text-muted-foreground">Manage your profile and work preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={staffProfile.avatar || "/placeholder.svg"} alt={staffProfile.name} />
                <AvatarFallback className="text-lg">
                  {staffProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{staffProfile.name}</h3>
                <p className="text-muted-foreground">{staffProfile.role}</p>
                <Badge variant="secondary" className="mt-2">
                  {staffProfile.department}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Employee ID:</span> {staffProfile.employeeId}
                </p>
                <p>
                  <span className="font-medium">Hire Date:</span> {new Date(staffProfile.hireDate).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Mike" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Johnson" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={staffProfile.email} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={staffProfile.phone} />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={staffProfile.role} disabled />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Skills & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5" />
                  <span>Skills & Certifications</span>
                </CardTitle>
                <CardDescription>Your professional qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {staffProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Add Skill
                  </Button>
                </div>
                <div>
                  <Label className="text-base font-medium">Certifications</Label>
                  <div className="space-y-2 mt-2">
                    {staffProfile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{cert}</span>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Add Certification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Work Schedule</span>
                </CardTitle>
                <CardDescription>Your current work schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(staffProfile.workSchedule).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Request Schedule Change
                </Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose how you want to receive work notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked={staffProfile.notifications.email} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive urgent notifications via text</p>
                    </div>
                    <Switch defaultChecked={staffProfile.notifications.sms} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Task Assignments</p>
                      <p className="text-sm text-muted-foreground">Get notified when new tasks are assigned</p>
                    </div>
                    <Switch defaultChecked={staffProfile.notifications.taskAssignments} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Emergency Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive emergency maintenance alerts</p>
                    </div>
                    <Switch defaultChecked={staffProfile.notifications.emergencyAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Schedule Changes</p>
                      <p className="text-sm text-muted-foreground">Get notified about schedule updates</p>
                    </div>
                    <Switch defaultChecked={staffProfile.notifications.scheduleChanges} />
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
