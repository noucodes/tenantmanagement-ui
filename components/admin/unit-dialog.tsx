import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface UnitFormValues {
    id?: number;
    unit_number: string;
    floor: string;
    bedrooms: string;
    bathrooms: string;
    rent_amount: string;
    square_feet: string;
    status: "vacant" | "occupied" | "maintenance";
}

interface AddUnitDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (values: UnitFormValues) => Promise<void>;
    editingUnit?: UnitFormValues | null;
    children?: React.ReactNode;
}

export function AddUnitDialog({ isOpen, onOpenChange, onSave, editingUnit, children }: AddUnitDialogProps) {
    const [formData, setFormData] = useState<UnitFormValues>({
        unit_number: "",
        floor: "",
        bedrooms: "",
        bathrooms: "",
        rent_amount: "",
        square_feet: "",
        status: "vacant",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingUnit) {
            setFormData({
                ...editingUnit,
                // Ensure numbers are converted to strings for inputs
                floor: String(editingUnit.floor || ""),
                bedrooms: String(editingUnit.bedrooms || ""),
                bathrooms: String(editingUnit.bathrooms || ""),
                rent_amount: String(editingUnit.rent_amount || ""),
                square_feet: String(editingUnit.square_feet || ""),
            });
        } else {
            setFormData({ unit_number: "", floor: "", bedrooms: "", bathrooms: "", rent_amount: "", square_feet: "", status: "vacant" });
        }
    }, [editingUnit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <div onClick={() => onOpenChange(true)}>{children}</div>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingUnit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_number">Unit Number</Label>
                            <Input
                                id="unit_number"
                                value={formData.unit_number}
                                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="floor">Floor</Label>
                            <Input
                                id="floor"
                                type="number"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bathrooms">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                value={formData.bathrooms}
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rent">Rent Amount ($)</Label>
                        <Input
                            id="rent"
                            type="number"
                            value={formData.rent_amount}
                            onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                            required
                        />
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
                                <SelectItem value="vacant">Vacant</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Unit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}