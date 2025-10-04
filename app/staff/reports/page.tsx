"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Clock, CheckCircle, Download, Calendar, Award, Target } from "lucide-react"

export default function ReportsPage() {
    const [timeRange, setTimeRange] = useState("month")

    // Mock performance data
    const performanceStats = {
        tasksCompleted: 47,
        avgResponseTime: "2.3 hours",
        customerRating: 4.8,
        onTimeCompletion: "96%",
        totalHours: 156,
        efficiency: "94%",
    }

    const monthlyData = [
        { month: "Jan", completed: 42, avgTime: 2.8, rating: 4.6 },
        { month: "Feb", completed: 38, avgTime: 2.5, rating: 4.7 },
        { month: "Mar", completed: 45, avgTime: 2.3, rating: 4.8 },
        { month: "Apr", completed: 47, avgTime: 2.1, rating: 4.9 },
    ]

    const categoryBreakdown = [
        { category: "Plumbing", count: 18, percentage: 38 },
        { category: "Electrical", count: 12, percentage: 26 },
        { category: "HVAC", count: 10, percentage: 21 },
        { category: "Appliance", count: 7, percentage: 15 },
    ]

    const recentAchievements = [
        {
            title: "Response Time Champion",
            description: "Maintained under 2.5 hour average response time",
            date: "2024-01-20",
            type: "performance",
        },
        {
            title: "Customer Satisfaction Star",
            description: "Achieved 4.8+ rating for 3 consecutive months",
            date: "2024-01-15",
            type: "satisfaction",
        },
        {
            title: "Efficiency Expert",
            description: "Completed 96% of tasks on time this month",
            date: "2024-01-10",
            type: "efficiency",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Track your performance and productivity metrics</p>
                </div>
                <div className="flex gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.tasksCompleted}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.avgResponseTime}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">-0.2h</span> improvement
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.customerRating}/5</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+0.1</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On-Time Completion</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.onTimeCompletion}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.totalHours}h</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceStats.efficiency}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+1%</span> from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Reports */}
            <Tabs defaultValue="performance" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="performance">Performance Trends</TabsTrigger>
                    <TabsTrigger value="categories">Task Categories</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Performance Trends</CardTitle>
                            <CardDescription>Track your performance metrics over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm font-medium w-12">{data.month}</div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{data.completed}</div>
                                                    <div className="text-xs text-muted-foreground">Tasks</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{data.avgTime}h</div>
                                                    <div className="text-xs text-muted-foreground">Avg Time</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{data.rating}</div>
                                                    <div className="text-xs text-muted-foreground">Rating</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">View Details</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Category Breakdown</CardTitle>
                            <CardDescription>Distribution of tasks by category this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categoryBreakdown.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-medium min-w-20">{category.category}</div>
                                            <div className="flex-1 bg-muted rounded-full h-2 min-w-32">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                                            <Badge variant="outline">{category.count} tasks</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Achievements</CardTitle>
                            <CardDescription>Your recent accomplishments and milestones</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentAchievements.map((achievement, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="flex-shrink-0">
                                            {achievement.type === "performance" && <TrendingUp className="h-8 w-8 text-blue-500" />}
                                            {achievement.type === "satisfaction" && <Award className="h-8 w-8 text-yellow-500" />}
                                            {achievement.type === "efficiency" && <Target className="h-8 w-8 text-green-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{achievement.title}</h3>
                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Earned on {new Date(achievement.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">New</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
