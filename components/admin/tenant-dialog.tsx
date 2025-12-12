import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you use sonner for toasts

export interface TenantFormValues {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone: string;
    occupation?: string;
    monthly_income?: string;
    status: "active" | "inactive" | "prospect";
}

interface TenantDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (values: TenantFormValues) => Promise<void>;
    editingTenant?: TenantFormValues | null;
}

export function TenantDialog({ isOpen, onOpenChange, onSave, editingTenant }: TenantDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TenantFormValues>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        occupation: "",
        monthly_income: "",
        status: "active",
    });

    useEffect(() => {
        if (editingTenant) {
            setFormData({
                ...editingTenant,
                password: "",
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: "",
                occupation: "",
                monthly_income: "",
                status: "active",
            });
        }
    }, [editingTenant, isOpen]);

    // ✅ New Handler: Only allow numbers and max 11 digits
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Regex: Only allow digits (0-9)
        if (!/^\d*$/.test(value)) return;

        // Limit to 11 characters
        if (value.length <= 11) {
            setFormData({ ...formData, phone: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Validation: Must be exactly 11 digits
        if (formData.phone.length !== 11) {
            toast.error("Phone number must be exactly 11 digits (e.g., 09123456789)");
            return;
        }

        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingTenant ? "Edit Tenant Profile" : "Add New Tenant"}</DialogTitle>
                    <DialogDescription>
                        {editingTenant
                            ? "Update tenant contact and personal details."
                            : "Create a new tenant profile and user account."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={!!editingTenant}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone (11 Digits)</Label>
                            {/* ✅ Updated Input for Phone */}
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange} // Use our custom handler
                                placeholder="09xxxxxxxxx"
                                required
                                maxLength={11} // HTML attribute backup
                            />
                        </div>
                    </div>

                    {!editingTenant && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Temporary Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Create login password"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                                id="occupation"
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="income">Monthly Income</Label>
                            <Input
                                id="income"
                                type="number"
                                value={formData.monthly_income}
                                onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="prospect">Prospect</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                            {loading ? "Saving..." : editingTenant ? "Update Tenant" : "Add Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}