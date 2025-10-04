"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, User, Phone, Plus, ChevronLeft, ChevronRight } from "lucide-react"

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [viewMode, setViewMode] = useState("day")

    // Mock schedule data
    const todaySchedule = [
        {
            id: 1,
            time: "09:00 AM",
            duration: "2 hours",
            title: "HVAC Repair",
            description: "Fix heating system at Oak Street Condos",
            property: "Oak Street Condos",
            unit: "5B",
            tenant: "Sarah Smith",
            tenantPhone: "(555) 987-6543",
            priority: "high",
            status: "scheduled",
        },
        {
            id: 2,
            time: "11:30 AM",
            duration: "1.5 hours",
            title: "Plumbing Inspection",
            description: "Check kitchen faucet leak at Sunset Apartments",
            property: "Sunset Apartments",
            unit: "2A",
            tenant: "John Doe",
            tenantPhone: "(555) 123-4567",
            priority: "medium",
            status: "scheduled",
        },
        {
            id: 3,
            time: "02:00 PM",
            duration: "3 hours",
            title: "Appliance Repair",
            description: "Fix dishwasher noise issue",
            property: "Maple Gardens",
            unit: "1B",
            tenant: "Lisa Chen",
            tenantPhone: "(555) 234-5678",
            priority: "medium",
            status: "in-progress",
        },
        {
            id: 4,
            time: "04:30 PM",
            duration: "1 hour",
            title: "Follow-up Inspection",
            description: "Check completed electrical work",
            property: "Pine View Townhomes",
            unit: "3C",
            tenant: "Robert Wilson",
            tenantPhone: "(555) 456-7890",
            priority: "low",
            status: "completed",
        },
    ]

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 border-green-200 text-green-800"
            case "in-progress":
                return "bg-blue-100 border-blue-200 text-blue-800"
            case "scheduled":
                return "bg-orange-100 border-orange-200 text-orange-800"
            default:
                return "bg-gray-100 border-gray-200 text-gray-800"
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground">Manage your daily appointments and tasks</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Task
                </Button>
            </div>

            {/* View Controls */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Select value={viewMode} onValueChange={setViewMode}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Day View</SelectItem>
                                    <SelectItem value="week">Week View</SelectItem>
                                    <SelectItem value="month">Month View</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium min-w-32 text-center">
                                    {selectedDate?.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <Button variant="outline" size="sm">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Today
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Calendar */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                    </CardContent>
                </Card>

                {/* Schedule */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Schedule</CardTitle>
                            <CardDescription>{todaySchedule.length} appointments scheduled for today</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {todaySchedule.map((appointment) => (
                                <div key={appointment.id} className={`p-4 rounded-lg border-l-4 ${getStatusColor(appointment.status)}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Clock className="h-4 w-4" />
                                                    {appointment.time}
                                                </div>
                                                <Badge variant="outline">{appointment.duration}</Badge>
                                                <Badge variant={getPriorityColor(appointment.priority) as any}>{appointment.priority}</Badge>
                                                <Badge variant="outline" className="capitalize">
                                                    {appointment.status.replace("-", " ")}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1">{appointment.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-3">{appointment.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{appointment.property}</p>
                                                <p className="text-xs text-muted-foreground">Unit {appointment.unit}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{appointment.tenant}</p>
                                                <p className="text-xs text-muted-foreground">Tenant</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{appointment.tenantPhone}</p>
                                                <p className="text-xs text-muted-foreground">Contact</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="h-4 w-4" />
                                            Scheduled for {selectedDate?.toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            {appointment.status === "scheduled" && <Button size="sm">Start Task</Button>}
                                            {appointment.status === "in-progress" && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    Complete
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline">
                                                Reschedule
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <CalendarIcon className="h-5 w-5" />
                                    <span>Schedule Break</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Clock className="h-5 w-5" />
                                    <span>Log Time</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Plus className="h-5 w-5" />
                                    <span>Add Appointment</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
