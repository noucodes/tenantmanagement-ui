"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Calendar, DollarSign, FileText, AlertTriangle, Ban, Trash2 } from "lucide-react"
import { toast, Toaster } from "sonner"

// Services & Components
import { leaseService } from "@/services/leaseService"
import { LeaseDialog, LeaseFormValues } from "@/components/admin/lease-dialog"

export default function LeasesPage() {
  const [leases, setLeases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLease, setEditingLease] = useState<any>(null)

  // ✅ Fetch Leases
  const fetchLeases = async () => {
    try {
      setLoading(true)
      const data = await leaseService.getAll()
      setLeases(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load leases")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeases()
  }, [])

  const handleSave = async (values: LeaseFormValues) => {
    try {
      const payload = {
        ...values,
        tenant_id: values.tenant_id, // Keep as String (UUID)
        unit_id: values.unit_id,     // Keep as String (UUID)
        rent_amount: Number(values.rent_amount), // Money is still a number
        security_deposit: Number(values.security_deposit || 0),
        payment_day: Number(values.payment_day || 1),
      };

      console.log("🚀 Payload being sent:", payload);

      if (editingLease && editingLease.id) {
        await leaseService.update(editingLease.id, payload)
        toast.success("Lease updated")
      } else {
        await leaseService.create(payload)
        toast.success("Lease created successfully")
      }
      setIsDialogOpen(false)
      setEditingLease(null)
      fetchLeases()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to save lease")
    }
  }

  const handleTerminateLease = async (leaseId: string) => { // Accept string
    if (!confirm("Terminate this lease?")) return;
    try {
      await leaseService.terminate(leaseId)
      toast.success("Lease terminated")
      fetchLeases()
    } catch (err) {
      toast.error("Failed to terminate lease")
    }
  }

  const handleDeleteLease = async (leaseId: string) => { // Accept string
    if (!confirm("Delete this lease record?")) return;
    try {
      await leaseService.delete(leaseId)
      toast.success("Lease deleted")
      fetchLeases()
    } catch (err) {
      toast.error("Failed to delete lease")
    }
  }

  // Helper: Calculate days remaining
  const getDaysUntilExpiry = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Filtering Logic
  const filteredLeases = leases.filter((lease) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch =
      lease.tenant_name?.toLowerCase().includes(searchString) ||
      lease.property_name?.toLowerCase().includes(searchString) ||
      lease.unit_number?.toLowerCase().includes(searchString);

    let matchesFilter = true;
    if (filterStatus !== "all") {
      matchesFilter = lease.status === filterStatus;
      if (filterStatus === 'expiring') {
        // Custom logic for expiring filter
        const days = getDaysUntilExpiry(lease.end_date);
        matchesFilter = lease.status === 'active' && days <= 60 && days > 0;
      }
    }

    return matchesSearch && matchesFilter;
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "expiring": return "bg-yellow-100 text-yellow-800"
      case "expired": return "bg-red-100 text-red-800"
      case "terminated": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Stats Calculation
  const activeLeases = leases.filter(l => l.status === 'active');
  const expiringCount = activeLeases.filter(l => getDaysUntilExpiry(l.end_date) <= 60).length;
  const totalRevenue = activeLeases.reduce((sum, l) => sum + Number(l.rent_amount), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lease Management</h1>
            <p className="text-slate-600 mt-1">Create, renew, and terminate leases</p>
          </div>

          <LeaseDialog
            isOpen={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingLease(null);
            }}
            onSave={handleSave}
            editingLease={editingLease}
          />

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => { setEditingLease(null); setIsDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Lease
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Leases</p>
                  <p className="text-2xl font-bold text-slate-900">{activeLeases.length}</p>
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
                  <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          {/* Average Lease Length (Simplified placeholder) */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Term</p>
                  <p className="text-2xl font-bold text-slate-900">12 Mo</p>
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
                  placeholder="Search by tenant, property, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leases</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
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
            {loading && <div className="text-center py-4">Loading leases...</div>}

            <div className="space-y-4">
              {!loading && filteredLeases.map((lease) => {
                const daysLeft = getDaysUntilExpiry(lease.end_date);
                const isExpiring = lease.status === 'active' && daysLeft <= 60 && daysLeft > 0;

                return (
                  <div key={lease.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">

                      {/* Column 1: Tenant */}
                      <div>
                        <p className="font-medium text-slate-900">{lease.tenant_name}</p>
                        <p className="text-sm text-slate-600">{lease.property_name}</p>
                      </div>

                      {/* Column 2: Unit */}
                      <div>
                        <p className="text-sm font-medium text-slate-900">Unit {lease.unit_number}</p>
                        <Badge variant="outline" className="text-xs">
                          {lease.bedrooms} bed / {lease.bathrooms} bath
                        </Badge>
                      </div>

                      {/* Column 3: Dates */}
                      <div>
                        <p className="text-sm text-slate-600">Start: {new Date(lease.start_date).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-600">End: {new Date(lease.end_date).toLocaleDateString()}</p>
                      </div>

                      {/* Column 4: Financials */}
                      <div>
                        <p className="text-sm font-medium text-slate-900">${lease.rent_amount}/mo</p>
                        <p className="text-sm text-slate-600">Dep: ${lease.security_deposit}</p>
                      </div>

                      {/* Column 5: Status */}
                      <div>
                        <Badge className={getStatusColor(isExpiring ? 'expiring' : lease.status)}>
                          {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                        </Badge>
                        {isExpiring && (
                          <p className="text-xs text-amber-600 mt-1 font-semibold">{daysLeft} days left</p>
                        )}
                      </div>

                      {/* Column 6: Actions */}
                      <div className="flex space-x-2 items-center">
                        {lease.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Terminate Lease"
                            onClick={() => handleTerminateLease(lease.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}

                        <Button variant="outline" size="sm" onClick={() => { setEditingLease(lease); setIsDialogOpen(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* Only allow deleting if terminated/inactive to preserve history */}
                        {lease.status !== 'active' && (
                          <Button variant="outline" size="sm" onClick={() => handleDeleteLease(lease.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!loading && filteredLeases.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No leases found matching your filters.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}