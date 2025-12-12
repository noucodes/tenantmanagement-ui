import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Services
import { leaseService } from "@/services/leaseService";

export interface PaymentFormValues {
    id?: string;
    lease_id: string; // UUID
    amount: string;
    payment_date: string;
    due_date: string;
    payment_method: string;
    transaction_id?: string;
    status: "pending" | "completed" | "late" | "failed";
    late_fee: string;
    notes?: string;
}

interface PaymentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (values: PaymentFormValues) => Promise<void>;
    editingPayment?: any | null;
}

export function PaymentDialog({ isOpen, onOpenChange, onSave, editingPayment }: PaymentDialogProps) {
    const [loading, setLoading] = useState(false);
    const [leases, setLeases] = useState<any[]>([]); // Active leases to select from

    const [formData, setFormData] = useState<PaymentFormValues>({
        lease_id: "",
        amount: "",
        payment_date: new Date().toISOString().split('T')[0], // Default to today
        due_date: "",
        payment_method: "cash",
        transaction_id: "",
        status: "completed", // Default to completed if recording a payment
        late_fee: "0",
        notes: ""
    });

    // Load Active Leases for Dropdown
    useEffect(() => {
        if (isOpen) {
            const loadLeases = async () => {
                try {
                    // We assume your leaseService.getAll supports filtering, 
                    // or we fetch all and filter client-side for active ones
                    const data = await leaseService.getAll();
                    const active = Array.isArray(data) ? data.filter((l: any) => l.status === 'active') : [];
                    setLeases(active);
                } catch (error) {
                    console.error("Failed to load leases", error);
                    toast.error("Failed to load active leases");
                }
            };
            loadLeases();
        }
    }, [isOpen]);

    // Load Edit Data
    useEffect(() => {
        if (editingPayment) {
            setFormData({
                id: String(editingPayment.id),
                lease_id: String(editingPayment.lease_id),
                amount: String(editingPayment.amount),
                payment_date: editingPayment.payment_date ? new Date(editingPayment.payment_date).toISOString().split('T')[0] : "",
                due_date: editingPayment.due_date ? new Date(editingPayment.due_date).toISOString().split('T')[0] : "",
                payment_method: editingPayment.payment_method || "cash",
                transaction_id: editingPayment.transaction_id || "",
                status: editingPayment.status || "completed",
                late_fee: String(editingPayment.late_fee || 0),
                notes: editingPayment.notes || ""
            });
        } else {
            // Reset
            setFormData({
                lease_id: "",
                amount: "",
                payment_date: new Date().toISOString().split('T')[0],
                due_date: "",
                payment_method: "cash",
                transaction_id: "",
                status: "completed",
                late_fee: "0",
                notes: ""
            });
        }
    }, [editingPayment, isOpen]);

    // Auto-fill Amount when Lease is selected
    const handleLeaseChange = (leaseId: string) => {
        const selectedLease = leases.find(l => String(l.id) === leaseId);
        if (selectedLease) {
            setFormData(prev => ({
                ...prev,
                lease_id: leaseId,
                amount: String(selectedLease.rent_amount), // Auto-fill rent
                // Optional: Auto-calculate next due date logic could go here
            }));
        } else {
            setFormData(prev => ({ ...prev, lease_id: leaseId }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lease_id) return toast.error("Please select a Lease/Tenant");
        if (!formData.amount) return toast.error("Amount is required");
        if (!formData.payment_date) return toast.error("Payment Date is required");

        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {/* 👇 RESTRICT HEIGHT: max-h-[85vh] and flex-col */}
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{editingPayment ? "Edit Payment" : "Record Payment"}</DialogTitle>
                    <DialogDescription>Record a rent payment against an active lease.</DialogDescription>
                </DialogHeader>

                {/* 👇 SCROLLABLE CONTAINER: flex-1 overflow-y-auto */}
                <div className="flex-1 overflow-y-auto px-1">
                    <form id="payment-form" onSubmit={handleSubmit} className="grid gap-4 py-4">

                        <div className="grid gap-2">
                            <Label>Tenant / Unit <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.lease_id}
                                onValueChange={handleLeaseChange}
                                disabled={!!editingPayment} // Don't change lease on edit
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lease..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {leases.map(lease => (
                                        <SelectItem key={lease.id} value={String(lease.id)}>
                                            {lease.tenant_name} — {lease.property_name} ({lease.unit_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Amount ($) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Method</Label>
                                <Select
                                    value={formData.payment_method}
                                    onValueChange={(val) => setFormData({ ...formData, payment_method: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="credit_card">Credit Card</SelectItem>
                                        <SelectItem value="online">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Payment Date <span className="text-red-500">*</span></Label>
                                <Input
                                    type="date"
                                    value={formData.payment_date}
                                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Due Date (For Reference)</Label>
                                <Input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="completed">Completed (Paid)</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="late">Late</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Late Fee ($)</Label>
                                <Input
                                    type="number"
                                    value={formData.late_fee}
                                    onChange={(e) => setFormData({ ...formData, late_fee: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Transaction ID / Ref #</Label>
                            <Input
                                value={formData.transaction_id}
                                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                                placeholder="Optional check number or transaction ID"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </form>
                </div>

                {/* 👇 FIXED FOOTER with form linkage */}
                <DialogFooter>
                    <Button type="submit" form="payment-form" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading ? "Saving..." : "Record Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}