import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { tenantService } from "@/services/tenantService";
import { unitService } from "@/services/unitService";

export interface LeaseFormValues {
    id?: string;
    tenant_id: string;
    unit_id: string;
    start_date: string;
    end_date: string;
    rent_amount: string;
    security_deposit: string;
    payment_day: string;
    status: "active" | "pending" | "terminated";
    terms?: string;
    notes?: string;
}

interface LeaseDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (values: LeaseFormValues) => Promise<void>;
    editingLease?: any | null;
}

export function LeaseDialog({ isOpen, onOpenChange, onSave, editingLease }: LeaseDialogProps) {
    const [loading, setLoading] = useState(false);
    const [tenants, setTenants] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    const [formData, setFormData] = useState<LeaseFormValues>({
        tenant_id: "",
        unit_id: "",
        start_date: "",
        end_date: "",
        rent_amount: "",
        security_deposit: "",
        payment_day: "1",
        status: "active",
        terms: "",
        notes: ""
    });

    useEffect(() => {
        if (isOpen) {
            const loadDropdowns = async () => {
                try {
                    const [tData, uData] = await Promise.all([
                        tenantService.getAll(),
                        unitService.getAll(editingLease ? {} : { vacant: true })
                    ]);
                    setTenants(Array.isArray(tData) ? tData : []);
                    setUnits(Array.isArray(uData) ? uData : []);
                } catch (error) {
                    console.error("Failed to load dropdowns", error);
                    toast.error("Failed to load lists");
                }
            };
            loadDropdowns();
        }
    }, [isOpen, editingLease]);

    useEffect(() => {
        if (editingLease) {
            setFormData({
                id: String(editingLease.id),
                tenant_id: String(editingLease.tenant_id || ""),
                unit_id: String(editingLease.unit_id || ""),
                start_date: editingLease.start_date ? new Date(editingLease.start_date).toISOString().split('T')[0] : "",
                end_date: editingLease.end_date ? new Date(editingLease.end_date).toISOString().split('T')[0] : "",
                rent_amount: String(editingLease.rent_amount || ""),
                security_deposit: String(editingLease.security_deposit || 0),
                payment_day: String(editingLease.payment_day || 1),
                status: editingLease.status || "active",
                terms: editingLease.terms || "",
                notes: editingLease.notes || ""
            });
        } else {
            setFormData({
                tenant_id: "",
                unit_id: "",
                start_date: "",
                end_date: "",
                rent_amount: "",
                security_deposit: "",
                payment_day: "1",
                status: "active",
                terms: "",
                notes: ""
            });
        }
    }, [editingLease, isOpen]);

    const handleUnitChange = (unitId: string) => {
        const selectedUnit = units.find(u => String(u.id) === unitId);
        setFormData(prev => ({
            ...prev,
            unit_id: unitId,
            rent_amount: selectedUnit?.rent_amount ? String(selectedUnit.rent_amount) : ""
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tenant_id) return toast.error("Please select a Tenant");
        if (!formData.unit_id) return toast.error("Please select a Unit");
        if (!formData.rent_amount) return toast.error("Rent Amount is required");

        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {/* 👇 Fixed Max Height and Overflow Handling */}
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{editingLease ? "Edit Lease" : "Create New Lease"}</DialogTitle>
                    <DialogDescription>Assign a tenant to a unit.</DialogDescription>
                </DialogHeader>

                {/* 👇 Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-1">
                    <form id="lease-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Tenant <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.tenant_id}
                                    onValueChange={(val) => setFormData({ ...formData, tenant_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tenant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tenants.map(t => (
                                            <SelectItem key={String(t.id)} value={String(t.id)}>
                                                {t.first_name} {t.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Property & Unit <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.unit_id}
                                    onValueChange={handleUnitChange}
                                    disabled={!!editingLease}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map(u => (
                                            <SelectItem key={String(u.id)} value={String(u.id)}>
                                                Unit {u.unit_number} (${u.rent_amount})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date <span className="text-red-500">*</span></Label>
                                <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date <span className="text-red-500">*</span></Label>
                                <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Monthly Rent <span className="text-red-500">*</span></Label>
                                <Input type="number" value={formData.rent_amount} readOnly className="bg-muted" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Deposit</Label>
                                <Input type="number" value={formData.security_deposit} onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Due Day</Label>
                                <Input type="number" min="1" max="31" value={formData.payment_day} onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })} placeholder="1" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Lease Terms</Label>
                            <Textarea value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} />
                        </div>
                    </form>
                </div>

                {/* 👇 Fixed Footer */}
                <DialogFooter>
                    <Button type="submit" form="lease-form" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading ? "Saving..." : editingLease ? "Update Lease" : "Create Lease"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}