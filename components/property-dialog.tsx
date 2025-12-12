"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type PropertyFormValues = {
    id?: string;
    name: string;
    property_type: string;
    address: string;
    city: string;
    state: string;
    zipcode?: string;
    owner_name: string;
    description?: string;
};

type AddPropertyDialogProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: PropertyFormValues, editing?: boolean) => Promise<void>;
    editingProperty?: PropertyFormValues | null;
};

export function AddPropertyDialog({
    children,
    isOpen,
    onOpenChange,
    onSave,
    editingProperty,
}: AddPropertyDialogProps) {
    const form = useForm<PropertyFormValues>({
        defaultValues: {
            name: "",
            property_type: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
            owner_name: "",
            description: "",
        },
    });

    // Prefill form when editing
    useEffect(() => {
        if (editingProperty) {
            form.reset(editingProperty);
        } else {
            form.reset({
                name: "",
                property_type: "",
                address: "",
                city: "",
                state: "",
                zipcode: "",
                owner_name: "",
                description: "",
            });
        }
    }, [editingProperty, form]);

    const onSubmit = async (values: PropertyFormValues) => {
        try {
            await onSave(values, !!editingProperty);
            toast.success(
                editingProperty ? "Property updated successfully" : "Property created successfully"
            );
            onOpenChange(false);
            form.reset();
        } catch (err) {
            toast.error("Error saving property");
            console.error(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingProperty ? "Edit Property" : "Add New Property"}</DialogTitle>
                    <DialogDescription>
                        {editingProperty
                            ? "Update property details."
                            : "Create a new property to start managing units and tenants."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Property Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: "Property name is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Property Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter property name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Property Type */}
                            <FormField
                                control={form.control}
                                name="property_type"
                                rules={{ required: "Property type is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Property Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="apartment">Apartment</SelectItem>
                                                <SelectItem value="condo">Condo</SelectItem>
                                                <SelectItem value="house">House</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                                <SelectItem value="lot">Lot</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Owner Name */}
                        <FormField
                            control={form.control}
                            name="owner_name"
                            rules={{ required: "Owner name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter owner name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            rules={{ required: "Address is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter property address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* City / State / Zip */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter city" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                rules={{ required: "State is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter state" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="zipcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zipcode (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter zipcode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>



                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter property description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingProperty ? "Update Property" : "Create Property"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
