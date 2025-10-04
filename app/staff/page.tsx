"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Clock, CheckCircle, AlertTriangle, Calendar, MapPin, User, Phone, Plus, Filter } from "lucide-react"

export default function StaffDashboard() {
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const staffInfo = {
    name: "Mike Johnson",
    role: "Maintenance Technician",
    tasksToday: 4,
    completedThisWeek: 12,
    avgResponseTime: "2.5 hours",
  }

  const maintenanceRequests = [
    {
      id: 1,
      title: "Leaky faucet in kitchen",
      description: "The kitchen faucet has been dripping constantly for the past week.",
      status: "assigned",
      priority: "medium",
      category: "Plumbing",
      property: "Sunset Apartments",
      unit: "2A",
      tenant: "John Doe",
      tenantPhone: "(555) 123-4567",
      dateSubmitted: "2024-01-15",
      dueDate: "2024-01-25",
      estimatedTime: "2 hours",
    },
    {
      id: 2,
      title: "Heating not working properly",
      description: "The heating system is not maintaining temperature. Very cold in the apartment.",
      status: "assigned",
      priority: "high",
      category: "HVAC",
      property: "Oak Street Condos",
      unit: "5B",
      tenant: "Sarah Smith",
      tenantPhone: "(555) 987-6543",
      dateSubmitted: "2024-01-20",
      dueDate: "2024-01-22",
      estimatedTime: "4 hours",
    },
    {
      id: 3,
      title: "Broken light fixture in living room",
      description: "The main light fixture in the living room stopped working.",
      status: "in-progress",
      priority: "low",
      category: "Electrical",
      property: "Pine View Townhomes",
      unit: "3C",
      tenant: "Robert Wilson",
      tenantPhone: "(555) 456-7890",
      dateSubmitted: "2024-01-18",
      dueDate: "2024-01-28",
      estimatedTime: "1.5 hours",
    },
  ]

  const filteredRequests = maintenanceRequests.filter(
    (request) => statusFilter === "all" || request.status === statusFilter,
  )

  const updateStatus = (requestId: number, newStatus: string) => {
    console.log(`[v0] Updating request ${requestId} to ${newStatus}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "assigned":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {staffInfo.name}</h1>
          <p className="text-muted-foreground">You have {staffInfo.tasksToday} tasks scheduled for today.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffInfo.tasksToday}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffInfo.completedThisWeek}</div>
            <p className="text-xs text-muted-foreground">Great work!</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffInfo.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Below target</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceRequests.filter((r) => r.status !== "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">In progress or assigned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Manage your assigned maintenance requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Time Log
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="text-lg font-semibold">{request.title}</h3>
                    <Badge variant={getPriorityColor(request.priority) as any}>{request.priority}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {request.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{request.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{request.property}</p>
                    <p className="text-xs text-muted-foreground">Unit {request.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{request.tenant}</p>
                    <p className="text-xs text-muted-foreground">Tenant</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{request.tenantPhone}</p>
                    <p className="text-xs text-muted-foreground">Contact</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{request.estimatedTime}</p>
                    <p className="text-xs text-muted-foreground">Est. Time</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}</span>
                  {request.dueDate && <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>}
                </div>

                <div className="flex gap-2">
                  {request.status === "assigned" && (
                    <Button size="sm" onClick={() => updateStatus(request.id, "in-progress")}>
                      Start Work
                    </Button>
                  )}
                  {request.status === "in-progress" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(request.id, "completed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Contact Tenant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              {statusFilter === "all"
                ? "You don't have any maintenance tasks assigned."
                : `No tasks with status "${statusFilter}".`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
