"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wrench, Plus, ArrowLeft, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function MaintenancePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")

  // Mock data
  const maintenanceRequests = [
    {
      id: 1,
      title: "Leaky faucet in kitchen",
      description: "The kitchen faucet has been dripping constantly for the past week.",
      status: "in-progress",
      priority: "medium",
      category: "Plumbing",
      dateSubmitted: "2024-01-15",
      assignedTo: "Mike Johnson",
      estimatedCompletion: "2024-01-25",
    },
    {
      id: 2,
      title: "Broken light fixture in living room",
      description: "The main light fixture in the living room stopped working.",
      status: "completed",
      priority: "low",
      category: "Electrical",
      dateSubmitted: "2024-01-10",
      assignedTo: "Sarah Wilson",
      completedDate: "2024-01-12",
    },
    {
      id: 3,
      title: "Heating not working properly",
      description: "The heating system is not maintaining temperature. Very cold in the apartment.",
      status: "pending",
      priority: "high",
      category: "HVAC",
      dateSubmitted: "2024-01-20",
      assignedTo: null,
      estimatedCompletion: null,
    },
    {
      id: 4,
      title: "Bathroom door handle loose",
      description: "The door handle in the main bathroom is very loose and needs tightening.",
      status: "completed",
      priority: "low",
      category: "General Maintenance",
      dateSubmitted: "2024-01-05",
      assignedTo: "Mike Johnson",
      completedDate: "2024-01-08",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    console.log({ title, description, priority, category })
    setIsDialogOpen(false)
    setTitle("")
    setDescription("")
    setPriority("")
    setCategory("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 border-green-600"
      case "in-progress":
        return "text-blue-600 border-blue-600"
      case "pending":
        return "text-orange-600 border-orange-600"
      default:
        return "text-gray-600 border-gray-600"
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
                <h1 className="text-2xl font-bold">Maintenance Requests</h1>
                <p className="text-muted-foreground">Submit and track your maintenance requests</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Submit Maintenance Request</DialogTitle>
                  <DialogDescription>
                    Describe the issue you're experiencing and we'll assign it to our maintenance team.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="appliances">Appliances</SelectItem>
                        <SelectItem value="general">General Maintenance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High - Urgent/Safety Issue</SelectItem>
                        <SelectItem value="medium">Medium - Affects Daily Life</SelectItem>
                        <SelectItem value="low">Low - Cosmetic/Minor Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {maintenanceRequests.filter((r) => r.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {maintenanceRequests.filter((r) => r.status === "in-progress").length}
                  </div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {maintenanceRequests.filter((r) => r.status === "completed").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{maintenanceRequests.length}</div>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Requests List */}
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <Badge variant={getPriorityColor(request.priority) as any}>{request.priority}</Badge>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{request.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Category</p>
                        <p>{request.category}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Date Submitted</p>
                        <p>{new Date(request.dateSubmitted).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          {request.status === "completed" ? "Completed" : "Assigned To"}
                        </p>
                        <p>
                          {request.status === "completed"
                            ? new Date(request.completedDate!).toLocaleDateString()
                            : request.assignedTo || "Not assigned yet"}
                        </p>
                      </div>
                    </div>

                    {request.estimatedCompletion && request.status !== "completed" && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Estimated completion: {new Date(request.estimatedCompletion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {maintenanceRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No maintenance requests</h3>
              <p className="text-muted-foreground mb-4">You haven't submitted any maintenance requests yet.</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Request
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
