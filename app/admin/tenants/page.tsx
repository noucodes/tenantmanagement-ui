"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Home, Phone, Mail, Calendar, DollarSign, User } from "lucide-react"
import { toast, Toaster } from "sonner"

import { tenantService } from "@/services/tenantService"
import { TenantDialog, TenantFormValues } from "@/components/admin/tenant-dialog"

// Define the interface based on your Backend "findAll" query
interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  // Fields from LEFT JOINs
  property_name?: string;
  unit_number?: string;
  current_rent?: number;
  lease_start?: string;
  lease_end?: string;
  occupation?: string;
  monthly_income?: number;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<TenantFormValues | null>(null)

  // ✅ Fetch Tenants
  const fetchTenants = async () => {
    try {
      setLoading(true)
      const data = await tenantService.getAll()
      setTenants(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load tenants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  // ✅ Create / Update Tenant
  const handleSave = async (values: TenantFormValues) => {
    try {
      if (editingTenant && editingTenant.id) {
        // Update
        await tenantService.update(editingTenant.id, values)
        toast.success("Tenant profile updated")
      } else {
        // Create
        await tenantService.create(values)
        toast.success("Tenant created successfully")
      }
      setIsDialogOpen(false)
      setEditingTenant(null)
      fetchTenants() // Refresh list
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to save tenant")
    }
  }

  // ✅ Delete Tenant
  const handleDeleteTenant = async (id: number) => {
    if (!confirm("Are you sure? This will remove the tenant profile.")) return;

    try {
      await tenantService.delete(id);
      toast.success("Tenant deleted");
      fetchTenants();
    } catch (err) {
      toast.error("Failed to delete tenant");
    }
  }

  const handleEditClick = (tenant: Tenant) => {
    setEditingTenant({
      id: tenant.id,
      first_name: tenant.first_name,
      last_name: tenant.last_name,
      email: tenant.email,
      phone: tenant.phone,
      occupation: tenant.occupation || '',
      monthly_income: String(tenant.monthly_income || ''),
      status: tenant.status as any
    })
    setIsDialogOpen(true)
  }

  // Filtering Logic
  const filteredTenants = tenants.filter((tenant) => {
    const fullName = `${tenant.first_name} ${tenant.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || tenant.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "expiring": return "bg-yellow-100 text-yellow-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "prospect": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tenant Management</h1>
            <p className="text-slate-600 mt-1">Manage tenant profiles and view lease info</p>
          </div>

          <TenantDialog
            isOpen={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingTenant(null);
            }}
            onSave={handleSave}
            editingTenant={editingTenant}
          />

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => { setEditingTenant(null); setIsDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tenants by name, email, or property..."
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
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && <div className="text-center py-10">Loading tenants...</div>}

        {/* Tenants Grid */}
        <div className="grid gap-6">
          {!loading && filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      {/* You could add an avatar field to DB or use placeholder */}
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tenant.first_name} ${tenant.last_name}`} />
                      <AvatarFallback>
                        {tenant.first_name[0]}{tenant.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {tenant.first_name} {tenant.last_name}
                        </h3>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{tenant.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{tenant.phone}</span>
                        </div>

                        {/* Property Info - Only shows if Lease exists (Left Join) */}
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-slate-400" />
                          <span className={`${tenant.unit_number ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                            {tenant.unit_number
                              ? `${tenant.property_name} - Unit ${tenant.unit_number}`
                              : "Unassigned (No Lease)"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {tenant.current_rent ? `$${tenant.current_rent}/mo` : "-"}
                          </span>
                        </div>
                      </div>

                      {tenant.lease_start && (
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Lease: {new Date(tenant.lease_start).toLocaleDateString()} to {new Date(tenant.lease_end!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(tenant)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTenant(tenant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filteredTenants.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
              No tenants found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}