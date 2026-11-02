/**
 * Kangoo Xpress - OpenAPI Data Models & TypeScript Interfaces
 * Strictly typed interfaces for all REST endpoints and business models.
 */

// ==============================================================================
// 1. Catalog & Quoting Models (GET /catalog & POST /quotes)
// ==============================================================================

export interface BoxDimensions {
  length_in: number;
  width_in: number;
  height_in: number;
  volume_cubic_ft?: number;
}

export interface BoxOption {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  dimensions: BoxDimensions;
  max_weight_lb: number;
  popular?: boolean;
  recommended_for: string;
  badge?: string;
}

export interface InsurancePlan {
  id: string;
  code: string;
  name: string;
  coverage_amount_usd: number;
  coverage_formatted: string;
  description: string;
  recommended?: boolean;
}

export interface ExtraItem {
  id: string;
  code: string;
  name: string;
  category: 'furniture' | 'appliances' | 'oversized' | 'packaging';
  description: string;
  unit_name: string;
}

export interface SocialProofStats {
  rating: number;
  reviews_count: number;
  boxes_delivered_formatted: string;
  on_time_percentage: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  city_origin: string;
  city_dest: string;
  rating: number;
  comment: string;
  date: string;
  verified_delivery: boolean;
}

export interface CatalogResponse {
  boxes: BoxOption[];
  insurance_plans: InsurancePlan[];
  extra_items: ExtraItem[];
  stats: SocialProofStats;
  reviews: CustomerReview[];
}

export interface PostalCodeLookup {
  postal_code: string;
  state_code: string;
  state_name: string;
  municipality: string;
  settlements: string[]; // Colonias
  is_covered: boolean;
  delivery_estimate_days: {
    min: number;
    max: number;
  };
}

export interface QuoteExtraSelection {
  extra_id: string;
  quantity: number;
}

export interface QuoteRequest {
  box_id: string;
  destination_postal_code?: string;
  destination_state: string;
  insurance_plan_id: string;
  extras?: QuoteExtraSelection[];
  pickup_type?: 'dropoff_center' | 'home_pickup';
}

export interface QuoteBreakdown {
  base_shipping_formatted: string;
  insurance_formatted: string;
  extras_formatted: string;
  customs_tax_formatted: string;
  pickup_fee_formatted?: string;
  discount_formatted?: string;
}

/**
 * REGLA INVIOLABLE #1:
 * El total SIEMPRE lo devuelve la API en total_formatted.
 * Prohibido sumar o calcular en TypeScript.
 */
export interface QuoteResponse {
  quote_id: string;
  currency: 'USD' | 'MXN';
  breakdown: QuoteBreakdown;
  total_formatted: string;
  estimated_days_range: string;
  valid_until: string;
  summary_text: string;
}

// ==============================================================================
// 2. Tracking Models (GET /tracking/:guia)
// ==============================================================================

export type TrackingStatus = 
  | 'received'          // Recibido en bodega USA
  | 'in_transit'         // En tránsito internacional
  | 'customs'            // En inspección aduanal (AZUL)
  | 'out_for_delivery'   // En ruta de entrega final
  | 'delivered'          // Entregado al destinatario
  | 'pending_payment';   // REGLA: Sin pago no hay guía

export type StatusTone = 'success' | 'warning' | 'info' | 'danger' | 'neutral';

export interface TrackingTimelineStep {
  step_id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
  is_customs?: boolean; // Step highlighted in blue
}

export interface TrackingResponse {
  tracking_number: string | null; // null if pending_payment
  reference_id: string;
  status: TrackingStatus;
  status_label: string;
  status_tone: StatusTone;
  is_paid: boolean;
  needs_attention: boolean;
  attention_reason?: string;
  is_delayed: boolean;
  delay_reason?: string;
  origin_city: string;
  destination_city: string;
  recipient_name: string;
  box_type: string;
  estimated_delivery_date: string;
  timeline: TrackingTimelineStep[];
  payment_cta?: {
    message: string;
    action_url: string;
  };
}

// ==============================================================================
// 3. Collection Centers (GET /collection-centers)
// ==============================================================================

export interface CenterSchedule {
  days: string;
  hours: string;
}

export interface CollectionCenter {
  id: string;
  name: string;
  city: string;
  state: string;
  full_address: string;
  phone: string;
  whatsapp?: string;
  schedule: CenterSchedule[];
  directions_url: string;
  lat: number;
  lng: number;
  services: string[];
  is_active: boolean;
}

// ==============================================================================
// 4. Content Center (GET /site-content)
// ==============================================================================

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AllowedItem {
  id: string;
  name: string;
  category: string;
  recommendations: string;
  max_qty_hint?: string;
}

export interface ProhibitedItem {
  id: string;
  name: string;
  category: string;
  hazard_type: string;
  legal_warning: string;
}

export interface DeliveryEstimate {
  region: string;
  states: string[];
  days_range: string;
  shipping_frequency: string;
}

export interface StepGuide {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface SiteContentResponse {
  how_it_works: StepGuide[];
  faqs: FaqItem[];
  allowed_items: AllowedItem[];
  prohibited_items: ProhibitedItem[];
  delivery_times: DeliveryEstimate[];
}

// ==============================================================================
// 5. Public Forms Payloads
// ==============================================================================

export interface SpecialOrderPayload {
  website: string; // Honeypot (must be empty)
  fullName: string;
  email: string;
  phone: string;
  originCity: string;
  destinationState: string;
  itemDescription: string;
  estimatedWeightLb?: number;
  photos?: File[];
}

export interface PartnerCenterPayload {
  website: string; // Honeypot
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  storageCapacitySqFt: number;
  hasForklift: boolean;
  comments?: string;
}

export interface ContactPayload {
  website: string; // Honeypot
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ==============================================================================
// 6. User Account & Checkout Models
// ==============================================================================

export interface SavedAddress {
  id: string;
  alias: string;
  recipient_name: string;
  phone: string;
  street: string;
  exterior_number: string;
  interior_number?: string;
  postal_code: string;
  neighborhood: string;
  municipality: string;
  state: string;
  references?: string;
  is_default: boolean;
}

export interface UserShipmentSummary {
  id: string;
  reference_id: string;
  tracking_number: string | null;
  status: TrackingStatus;
  status_label: string;
  status_tone: StatusTone;
  created_at: string;
  recipient_name: string;
  destination_city: string;
  total_formatted: string;
  is_paid: boolean;
}

export interface UserShipmentDetail extends UserShipmentSummary {
  box_name: string;
  dimensions_text: string;
  insurance_plan_name: string;
  origin_address: string;
  destination_address: string;
  receipt_url?: string;
  breakdown: QuoteBreakdown;
  timeline: TrackingTimelineStep[];
}

export interface CheckoutWizardState {
  quote_id: string;
  box_id: string;
  box_name: string;
  destination_postal_code: string;
  destination_state: string;
  total_formatted: string;
  // Step 1: Recipient
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  // Step 2: Address
  street: string;
  exterior_number: string;
  interior_number?: string;
  neighborhood: string;
  municipality: string;
  references?: string;
  // Step 3: Fulfillment
  fulfillment_type: 'dropoff_center' | 'home_pickup';
  center_id?: string;
  pickup_address_us?: string;
  // Step 4: Payment
  payment_method: 'stripe' | 'paypal' | 'cash';
}
