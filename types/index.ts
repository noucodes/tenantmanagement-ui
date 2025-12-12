// ------------------------------------------
// Types
// ------------------------------------------

// The User object returned by your authService / JWT
interface User {
  id: string;
  email: string;
  role: string;
  name: string; // The field we fixed in the backend
  employeeId?: string;
  first_name?: string; // Fallback
}

// The Property object from your database
interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  property_type: string;

  // Stats
  total_units_count: number;
  occupied_units: number;
  vacant_units: number;
  monthly_revenue: number;

  // Timestamps (optional)
  created_at?: string;
  updated_at?: string;
}
