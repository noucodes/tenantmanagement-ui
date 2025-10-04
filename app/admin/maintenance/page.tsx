"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Wrench, AlertTriangle, Clock, CheckCircle, User, Calendar } from "lucide-react"

// Mock data for maintenance requests
const mockRequests = [
  {
    id: 1,
    tenant: "Sarah Johnson",
    property: "Sunset Apartments",
    unit: "Unit 2A",
    title: "Leaky Kitchen Faucet",
    description: "The kitchen faucet has been dripping constantly for the past week.",
    priority: "medium",
    status: "open",
    category: "plumbing",
    dateSubmitted: "2024-02-10",
    assignedTo: null,
    estimatedCost: 150,
  },
  {
    id: 2,
    tenant: "Michael Chen",
    property: "Oak Ridge Complex",
    unit: "Unit 1B",
    title: "Broken Air Conditioning",
    description: "AC unit stopped working completely. No cold air coming out.",
    priority: "high",
    status: "in-progress",
    category: "hvac",
    dateSubmitted: "2024-02-08",
    assignedTo: "John Smith",
    estimatedCost: 450,
  },
  {
    id: 3,
    tenant: "Emily Rodriguez",
    property: "Downtown Lofts",
    unit: "Unit 3C",
    title: "Flickering Lights",
    description: "Living room lights keep flickering on and off.",
    priority: "low",
    status: "completed",
    category: "electrical",
    dateSubmitted: "2024-02-05",
    assignedTo: "Mike Johnson",
    estimatedCost: 200,
    completedDate: "2024-02-12",
  },
]

const mockStaff = [
  { id: 1, name: "John Smith", specialty: "HVAC" },
  { id: 2, name: "Mike Johnson", specialty: "Electrical" },
  { id: 3, name: "Sarah Wilson", specialty: "Plumbing" },
  { id: 4, name: "David Brown", specialty: "General" },
]

export default function MaintenancePage() {
  const [requests, setRequests] = useState(mockRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const filteredRequests = requests.filter(
    (request) =>
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "on-hold":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleAssignRequest = (request: any) => {
    setSelectedRequest(request)
    setIsAssignDialogOpen(true)
  }

  const handleUpdateStatus = (requestId: number, newStatus: string) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              ...(newStatus === "completed" ? { completedDate: new Date().toISOString().split("T")[0] } : {}),
            }
          : request,
      ),
    )
  }

  const openRequests = requests.filter((r) => r.status === "open").length
  const inProgressRequests = requests.filter((r) => r.status === "in-progress").length
  const completedThisMonth = requests.filter(
    (r) => r.status === "completed" && r.completedDate?.startsWith("2024-02"),
  ).length
  const totalEstimatedCost = requests
    .filter((r) => r.status !== "completed")
    .reduce((sum, r) => sum + r.estimatedCost, 0)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Maintenance Management</h1>
            <p className="text-slate-600 mt-1">View and assign maintenance requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Open Requests</p>
                  <p className="text-2xl font-bold text-red-600">{openRequests}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-amber-600">{inProgressRequests}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed This Month</p>
                  <p className="text-2xl font-bold text-emerald-600">{completedThisMonth}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Estimated Costs</p>
                  <p className="text-2xl font-bold text-slate-900">${totalEstimatedCost}</p>
                </div>
                <Wrench className="w-8 h-8 text-emerald-600" />
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
                  placeholder="Search requests by tenant, property, title, or category..."
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
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{request.title}</h3>
                        <p className="text-slate-600">
                          {request.tenant} - {request.property} ({request.unit})
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span>
                              {request.status.replace("-", " ").charAt(0).toUpperCase() +
                                request.status.replace("-", " ").slice(1)}
                            </span>
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </Badge>
                      </div>
                    </div>

                    <p className="text-slate-700">{request.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Submitted: {request.dateSubmitted}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Category: {request.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Assigned: {request.assignedTo || "Unassigned"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">Est. Cost: ${request.estimatedCost}</span>
                      </div>
                    </div>

                    {request.completedDate && (
                      <div className="text-sm text-emerald-600">Completed on: {request.completedDate}</div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {request.status === "open" && (
                      <Button
                        size="sm"
                        onClick={() => handleAssignRequest(request)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Assign
                      </Button>
                    )}
                    {request.status === "in-progress" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(request.id, "completed")}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Select onValueChange={(value) => handleUpdateStatus(request.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assign Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Maintenance Request</DialogTitle>
              <DialogDescription>Assign this request to a staff member</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium">{selectedRequest.title}</h4>
                  <p className="text-sm text-slate-600">
                    {selectedRequest.tenant} - {selectedRequest.property}
                  </p>
                </div>
                <div>
                  <Label htmlFor="assignTo">Assign to Staff Member</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name} - {staff.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select defaultValue={selectedRequest.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Assignment Notes</Label>
                  <Textarea id="notes" placeholder="Add any notes for the assigned staff member..." rows={3} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle assignment logic here
                  setIsAssignDialogOpen(false)
                  if (selectedRequest) {
                    handleUpdateStatus(selectedRequest.id, "in-progress")
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Assign Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
