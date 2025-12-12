'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Search, Edit, Trash2, Home, MapPin } from 'lucide-react';
import { PropertyFormValues, AddPropertyDialog } from '@/components/property-dialog';
import { toast, Toaster } from 'sonner';

import { authService } from '@/services/authService';
import api from '@/lib/api';

export default function PropertiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Array<any>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to continue");
      router.push('/login');
      return;
    }
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    authService.getMe().then(freshUser => setUser(freshUser)).catch(() => { });
    getProperties();
  }, []);

  const getProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties');
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.properties || response.data.data || [];
      setProperties(data);
    } catch (err: any) {
      console.error("❌ Error fetching properties:", err);
      if (err.response?.status === 401) {
        authService.logout();
      } else {
        toast.error("Failed to load properties");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: PropertyFormValues, editing?: boolean) => {
    try {
      if (editing && values.id) {
        await api.put(`/properties/${values.id}`, values);
        toast.success("✅ Property updated successfully");
      } else {
        await api.post('/properties', values);
        toast.success("✅ Property created successfully");
      }
      setIsDialogOpen(false);
      setEditingProperty(null);
      getProperties();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save property");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("✅ Property deleted successfully");
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error("Failed to delete property");
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold">Property Management</h1>
                <p className="text-muted-foreground">
                  Welcome back, <span className="font-semibold text-primary">{user?.name || user?.first_name || 'Admin'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AddPropertyDialog
                isOpen={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditingProperty(null);
                }}
                editingProperty={editingProperty}
                onSave={handleSave}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </AddPropertyDialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        )}

        {!loading && filteredProperties.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {property.property_type || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingProperty(property); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(property.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>

                  {/* Property Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {property.total_units_count || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Units</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {property.occupied_units || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Occupied</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                      <div className="text-lg font-semibold">
                        ₱{(property.monthly_revenue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Vacant</div>
                      <div className="text-lg font-semibold text-orange-600">
                        {property.vacant_units || 0}
                      </div>
                    </div>
                  </div>

                  {/* 👇 NEW: View Units Button */}
                  <div className="pt-2 border-t mt-auto">
                    <Button asChild className="w-full" variant="outline">
                      {/* This links to your PropertyUnitsPage */}
                      <Link href={`/admin/properties/${property.id}`}>
                        <Home className="h-4 w-4 mr-2" />
                        View Units
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}