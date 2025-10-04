"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Calendar, DollarSign, FileText, AlertTriangle } from "lucide-react"

// Mock data for leases
const mockLeases = [
  {
    id: 1,
    tenant: "Sarah Johnson",
    property: "Sunset Apartments",
    unit: "Unit 2A",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    monthlyRent: 1200,
    securityDeposit: 1200,
    status: "active",
    daysUntilExpiry: 95,
  },
  {
    id: 2,
    tenant: "Michael Chen",
    property: "Oak Ridge Complex",
    unit: "Unit 1B",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    monthlyRent: 1450,
    securityDeposit: 1450,
    status: "expiring",
    daysUntilExpiry: 15,
  },
  {
    id: 3,
    tenant: "Emily Rodriguez",
    property: "Downtown Lofts",
    unit: "Unit 3C",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    monthlyRent: 1800,
    securityDeposit: 1800,
    status: "active",
    daysUntilExpiry: 245,
  },
]

export default function LeasesPage() {
  const [leases, setLeases] = useState(mockLeases)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedLease, setSelectedLease] = useState<any>(null)

  const filteredLeases = leases.filter(
    (lease) =>
      lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expiring":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "terminated":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateLease = () => {
    setIsAddDialogOpen(false)
  }

  const handleRenewLease = (leaseId: number) => {
    // Renew lease logic
    console.log("Renewing lease:", leaseId)
  }

  const handleTerminateLease = (leaseId: number) => {
    // Terminate lease logic
    setLeases(leases.map((lease) => (lease.id === leaseId ? { ...lease, status: "terminated" } : lease)))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lease Management</h1>
            <p className="text-slate-600 mt-1">Create, renew, and terminate leases</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Lease
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Lease</DialogTitle>
                <DialogDescription>Enter lease details and terms</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenant">Tenant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="michael">Michael Chen</SelectItem>
                        <SelectItem value="emily">Emily Rodriguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="property">Property & Unit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunset-2a">Sunset Apartments - Unit 2A</SelectItem>
                        <SelectItem value="oak-1b">Oak Ridge Complex - Unit 1B</SelectItem>
                        <SelectItem value="downtown-3c">Downtown Lofts - Unit 3C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Lease Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Lease End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyRent">Monthly Rent</Label>
                    <Input id="monthlyRent" type="number" placeholder="Enter monthly rent" />
                  </div>
                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input id="securityDeposit" type="number" placeholder="Enter security deposit" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="terms">Lease Terms</Label>
                  <Textarea id="terms" placeholder="Enter additional lease terms and conditions..." rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLease} className="bg-emerald-600 hover:bg-emerald-700">
                  Create Lease
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Leases</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {leases.filter((l) => l.status === "active").length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {leases.filter((l) => l.status === "expiring").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${leases.reduce((sum, l) => sum + l.monthlyRent, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Lease Length</p>
                  <p className="text-2xl font-bold text-slate-900">12 months</p>
                </div>
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search leases by tenant, property, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leases</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leases Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leases</CardTitle>
            <CardDescription>Manage all property leases and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeases.map((lease) => (
                <div
                  key={lease.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{lease.tenant}</p>
                      <p className="text-sm text-slate-600">{lease.property}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{lease.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Start: {lease.startDate}</p>
                      <p className="text-sm text-slate-600">End: {lease.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">${lease.monthlyRent}/month</p>
                      <p className="text-sm text-slate-600">Deposit: ${lease.securityDeposit}</p>
                    </div>
                    <div>
                      <Badge className={getStatusColor(lease.status)}>
                        {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                      </Badge>
                      {lease.status === "expiring" && (
                        <p className="text-xs text-amber-600 mt-1">{lease.daysUntilExpiry} days left</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {lease.status === "expiring" && (
                        <Button
                          size="sm"
                          onClick={() => handleRenewLease(lease.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Renew
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setSelectedLease(lease)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {lease.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTerminateLease(lease.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
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
