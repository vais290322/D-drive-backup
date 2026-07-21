export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'admin' | 'customer' | 'hotelier' | 'staff';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingType = 'flight' | 'hotel' | 'package';
export type ServiceLevel = 'economy' | 'standard' | 'premium';
export type PackageType = 'hajj' | 'umrah';
export type ContactStatus = 'pending' | 'in_progress' | 'resolved';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  is_direct: boolean;
  created_at: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  star_rating: number;
  price_per_night: number;
  currency: string;
  distance_to_haram: number | null;
  distance_to_masjid_nabawi: number | null;
  has_prayer_facilities: boolean;
  has_halal_food: boolean;
  has_gender_segregated_facilities: boolean;
  description: string | null;
  amenities: string[] | null;
  image_url: string | null;
  images?: string[];
  check_in_time?: string;
  check_out_time?: string;
  is_active: boolean;
  is_verified: boolean;
  owner_id: string;
  available_rooms: number;
  created_at: string;
  address?: string;
  updated_at?: string;
}

export interface Package {
  id: string;
  name: string;
  package_type: PackageType;
  service_level: ServiceLevel;
  duration_days: number;
  price: number;
  description: string | null;
  includes: string[] | null;
  flight_id: string | null;
  hotel_makkah_id: string | null;
  hotel_madinah_id: string | null;
  image_url: string | null;
  is_featured: boolean;
  available_slots: number;
  created_at: string;
  flight?: Flight;
  hotel_makkah?: Hotel;
  hotel_madinah?: Hotel;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: BookingType;
  status: BookingStatus;
  flight_id: string | null;
  hotel_id: string | null;
  package_id: string | null;
  travelers_count: number;
  check_in_date: string | null;
  check_out_date: string | null;
  total_price: number;
  special_requests: string | null;
  booking_reference: string | null;
  created_at: string;
  updated_at: string;
  flight?: Flight;
  hotel?: Hotel;
  package?: Package;
}

export interface Order {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  items: any;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  resource_type: 'guide' | 'checklist' | 'faq';
  image_url: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  departure_city?: string;
  arrival_city?: string;
  departure_date?: string;
  return_date?: string;
  travelers?: number;
  city?: string;
  check_in?: string;
  check_out?: string;
  min_price?: number;
  max_price?: number;
  star_rating?: number;
  package_type?: PackageType;
  service_level?: ServiceLevel;
}
