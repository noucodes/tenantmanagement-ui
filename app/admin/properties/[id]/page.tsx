'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Building2, Plus, Search, Edit, Trash2, ArrowLeft,
    MapPin, Home, DoorOpen, Users, Calendar
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// 👇 1. Import your services
import { propertyService } from '@/services/propertyService';
import { unitService } from '@/services/unitService';

// 👇 2. Import the Dialog Component (ensure you created this from my previous message)
import { AddUnitDialog, UnitFormValues } from '@/components/admin/unit-dialog';

// Interfaces
interface Unit {
    id: number;
    unit_number: string;
    floor?: number;
    bedrooms?: number;
    bathrooms?: number;
    square_feet?: number;
    rent_amount: number;
    status: 'vacant' | 'occupied';
    tenant_name?: string;
    tenant_email?: string;
    end_date?: string;
}

interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    total_units_count?: number;
    occupied_units?: number;
    vacant_units?: number;
    monthly_revenue?: number;
}

export default function PropertyUnitsPage() {
    const params = useParams();
    const propertyId = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitFormValues | null>(null);

    // ✅ Load Data using Services
    const loadData = async () => {
        try {
            setLoading(true);

            // Run both requests in parallel for speed
            const [propData, unitsData] = await Promise.all([
                propertyService.getById(propertyId),
                propertyService.getUnits(propertyId)
            ]);

            setProperty(propData);
            setUnits(Array.isArray(unitsData) ? unitsData : []);
        } catch (err: any) {
            console.error('Error loading data:', err);
            toast.error('Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            loadData();
        }
    }, [propertyId]);

    // ✅ Handle Save (Create or Update) using UnitService
    const handleSaveUnit = async (values: UnitFormValues) => {
        try {
            // Prepare payload
            const payload = {
                ...values,
                property_id: propertyId, // Important: Link unit to this property
                floor: Number(values.floor) || 0,
                bedrooms: Number(values.bedrooms) || 0,
                bathrooms: Number(values.bathrooms) || 0,
                rent_amount: Number(values.rent_amount) || 0,
                square_feet: Number(values.square_feet) || 0,
            };

            if (editingUnit && editingUnit.id) {
                // Update
                await unitService.update(editingUnit.id, payload);
                toast.success("Unit updated successfully");
            } else {
                // Create
                await unitService.create(payload);
                toast.success("Unit created successfully");
            }

            setIsDialogOpen(false);
            setEditingUnit(null);
            loadData(); // Refresh everything
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to save unit");
        }
    };

    // ✅ Handle Delete using UnitService
    const handleDeleteUnit = async (unitId: number) => {
        if (!confirm('Are you sure you want to delete this unit?')) return;
        try {
            await unitService.delete(unitId);
            toast.success('Unit deleted successfully');
            loadData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete unit');
        }
    };

    // Helper to open edit dialog
    const handleEditClick = (unit: Unit) => {
        setEditingUnit({
            id: unit.id,
            unit_number: unit.unit_number,
            floor: String(unit.floor || ''),
            bedrooms: String(unit.bedrooms || ''),
            bathrooms: String(unit.bathrooms || ''),
            rent_amount: String(unit.rent_amount),
            square_feet: String(unit.square_feet || ''),
            status: unit.status
        });
        setIsDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'occupied': return 'bg-green-500/10 text-green-700 border-green-200';
            case 'vacant': return 'bg-orange-500/10 text-orange-700 border-orange-200';
            default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'occupied': return <Users className="h-4 w-4" />;
            case 'vacant': return <DoorOpen className="h-4 w-4" />;
            default: return <Home className="h-4 w-4" />;
        }
    };

    const filteredUnits = units.filter((unit) => {
        const matchesSearch =
            unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || unit.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading && !property) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-right" />

            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/properties">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Properties
                                </Link>
                            </Button>
                            <div className="border-l pl-4">
                                <h1 className="text-2xl font-bold">{property?.name}</h1>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{property?.address}, {property?.city}, {property?.state}</span>
                                </div>
                            </div>
                        </div>

                        <AddUnitDialog
                            isOpen={isDialogOpen}
                            onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setEditingUnit(null);
                            }}
                            onSave={handleSaveUnit}
                            editingUnit={editingUnit}
                        >
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Unit
                            </Button>
                        </AddUnitDialog>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-muted-foreground">Total Units</p><p className="text-2xl font-bold">{property?.total_units_count || 0}</p></div>
                                <Building2 className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-muted-foreground">Occupied</p><p className="text-2xl font-bold text-green-600">{property?.occupied_units || 0}</p></div>
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-muted-foreground">Vacant</p><p className="text-2xl font-bold text-orange-600">{property?.vacant_units || 0}</p></div>
                                <DoorOpen className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div><p className="text-sm text-muted-foreground">Monthly Revenue</p><p className="text-2xl font-bold text-primary">${property?.monthly_revenue?.toLocaleString() || 0}</p></div>
                                <div className="h-8 w-8 text-primary font-bold text-2xl flex items-center justify-center">$</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search units..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')}>All</Button>
                                <Button variant={filterStatus === 'vacant' ? 'default' : 'outline'} onClick={() => setFilterStatus('vacant')}>Vacant</Button>
                                <Button variant={filterStatus === 'occupied' ? 'default' : 'outline'} onClick={() => setFilterStatus('occupied')}>Occupied</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Units Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUnits.map((unit) => (
                        <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary" />
                                            Unit {unit.unit_number}
                                        </CardTitle>
                                        {unit.floor && <p className="text-sm text-muted-foreground mt-1">Floor {unit.floor}</p>}
                                    </div>
                                    <Badge variant="outline" className={getStatusColor(unit.status)}>
                                        {getStatusIcon(unit.status)}
                                        <span className="ml-1 capitalize">{unit.status}</span>
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><p className="text-muted-foreground">Bedrooms</p><p className="font-semibold">{unit.bedrooms || '-'}</p></div>
                                    <div><p className="text-muted-foreground">Bathrooms</p><p className="font-semibold">{unit.bathrooms || '-'}</p></div>
                                    <div><p className="text-muted-foreground">Rent</p><p className="font-semibold">${unit.rent_amount.toLocaleString()}</p></div>
                                </div>

                                {unit.status === 'occupied' && (
                                    <div className="pt-3 border-t space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{unit.tenant_name || 'Unknown Tenant'}</span>
                                        </div>
                                        {unit.end_date && (
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Ends: {new Date(unit.end_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className=" border-t flex space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(unit)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeleteUnit(unit.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}