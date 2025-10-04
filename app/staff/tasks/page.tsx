"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Clock, CheckCircle, AlertTriangle, MapPin, User, Phone, Search, Filter, Plus } from "lucide-react"

export default function TasksPage() {
    const [statusFilter, setStatusFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Mock data for all tasks
    const allTasks = [
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
            status: "in-progress",
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
            status: "completed",
            priority: "low",
            category: "Electrical",
            property: "Pine View Townhomes",
            unit: "3C",
            tenant: "Robert Wilson",
            tenantPhone: "(555) 456-7890",
            dateSubmitted: "2024-01-18",
            dueDate: "2024-01-28",
            estimatedTime: "1.5 hours",
            completedDate: "2024-01-19",
        },
        {
            id: 4,
            title: "Dishwasher making loud noise",
            description: "The dishwasher is making unusual grinding noises during operation.",
            status: "assigned",
            priority: "medium",
            category: "Appliance",
            property: "Maple Gardens",
            unit: "1B",
            tenant: "Lisa Chen",
            tenantPhone: "(555) 234-5678",
            dateSubmitted: "2024-01-21",
            dueDate: "2024-01-26",
            estimatedTime: "3 hours",
        },
    ]

    const filteredTasks = allTasks.filter((task) => {
        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

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

    const updateStatus = (taskId: number, newStatus: string) => {
        console.log(`[v0] Updating task ${taskId} to ${newStatus}`)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                    <p className="text-muted-foreground">Manage all your assigned maintenance requests</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks, properties, or categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
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
                </CardContent>
            </Card>

            {/* Tasks by Status */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Tasks ({allTasks.length})</TabsTrigger>
                    <TabsTrigger value="assigned">
                        Assigned ({allTasks.filter((t) => t.status === "assigned").length})
                    </TabsTrigger>
                    <TabsTrigger value="in-progress">
                        In Progress ({allTasks.filter((t) => t.status === "in-progress").length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Completed ({allTasks.filter((t) => t.status === "completed").length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(task.status)}
                                            <h3 className="text-lg font-semibold">{task.title}</h3>
                                            <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {task.status.replace("-", " ")}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-4">{task.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{task.property}</p>
                                            <p className="text-xs text-muted-foreground">Unit {task.unit}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{task.tenant}</p>
                                            <p className="text-xs text-muted-foreground">Tenant</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{task.tenantPhone}</p>
                                            <p className="text-xs text-muted-foreground">Contact</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{task.estimatedTime}</p>
                                            <p className="text-xs text-muted-foreground">Est. Time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Submitted: {new Date(task.dateSubmitted).toLocaleDateString()}</span>
                                        {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                        {task.completedDate && <span>Completed: {new Date(task.completedDate).toLocaleDateString()}</span>}
                                    </div>

                                    <div className="flex gap-2">
                                        {task.status === "assigned" && (
                                            <Button size="sm" onClick={() => updateStatus(task.id, "in-progress")}>
                                                Start Work
                                            </Button>
                                        )}
                                        {task.status === "in-progress" && (
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(task.id, "completed")}
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
                </TabsContent>

                <TabsContent value="assigned" className="space-y-4">
                    {allTasks
                        .filter((t) => t.status === "assigned")
                        .map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(task.status)}
                                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                                <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                                            </div>
                                            <p className="text-muted-foreground mb-4">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                        <Button size="sm" onClick={() => updateStatus(task.id, "in-progress")}>
                                            Start Work
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>

                <TabsContent value="in-progress" className="space-y-4">
                    {allTasks
                        .filter((t) => t.status === "in-progress")
                        .map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(task.status)}
                                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                                <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                                            </div>
                                            <p className="text-muted-foreground mb-4">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatus(task.id, "completed")}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Mark Complete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    {allTasks
                        .filter((t) => t.status === "completed")
                        .map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(task.status)}
                                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                                <Badge variant="secondary">Completed</Badge>
                                            </div>
                                            <p className="text-muted-foreground mb-4">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Completed: {new Date(task.completedDate || task.dateSubmitted).toLocaleDateString()}
                                        </div>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>
            </Tabs>

            {filteredTasks.length === 0 && (
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
