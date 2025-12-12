// lib/db.ts

// Represents a Property entity in the database
export type Property = {
  id: string; // UUID primary key
  name: string; // Name of the property (max 200 chars)
  propertyType: string; // Type of property (max 50 chars)
  description?: string; // Description (text)
  address: string; // Full address (text)
  city?: string; // City (max 50 chars, optional)
  state?: string; // State (max 50 chars, optional)
  zipcode?: string; // Zipcode (max 20 chars, optional)
  ownerName: string; // Owner's name (max 100 chars)
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
};

// Represents a Unit entity in the database
export type Unit = {
  id: string; // UUID primary key
  propertyId: string; // UUID foreign key (unique, not null)
  unitNumber: string; // Unit number (max 20 chars, unique, not null)
  floor?: number; // Floor number (optional)
  bedrooms: number; // Number of bedrooms
  bathrooms: number; // Number of bathrooms
  rentAmount: number; // Rent amount (numeric with 10 digits, 2 decimals)
  status: "available" | "occupied"; // Status (max 20 chars, default 'available')
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
};
