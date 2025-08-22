// Payment System Types
export type PaymentMode = 'API_PROPRE' | 'DELEGUE'

export type PaymentProvider = 
  | 'WAVE' 
  | 'ORANGE_MONEY' 
  | 'MTN_MONEY' 
  | 'PAYSTACK' 
  | 'STRIPE' 
  | 'FLUTTERWAVE' 
  | 'PAYPAL'

export type PaymentChannel = 
  | 'CARD' 
  | 'MOBILE_MONEY' 
  | 'BANK_TRANSFER' 
  | 'CASH' 
  | 'CHECK'

export type PaymentStatus = 
  | 'CREATED' 
  | 'PENDING' 
  | 'SUCCEEDED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIAL_REFUND'

export type PayoutStatus = 
  | 'PENDING' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAID' 
  | 'FAILED'

export type PayoutChannel = 
  | 'ORANGE_MONEY' 
  | 'WAVE' 
  | 'MTN_MONEY' 
  | 'BANK_TRANSFER' 
  | 'CASH' 
  | 'CHECK'

export type WalletScope = 'OWNER' | 'TENANT'

export type LedgerType = 
  | 'PAYMENT_CREDIT' 
  | 'PLATFORM_FEE' 
  | 'PROVIDER_FEE' 
  | 'REFUND_DEBIT' 
  | 'PAYOUT_DEBIT' 
  | 'PAYOUT_FEE'

export type AuditScope = 'OWNER' | 'TENANT' | 'SYSTEM'

export type PaymentLimitLevel = 'STANDARD' | 'VIP' | 'ENTERPRISE'

// Interfaces
export interface PaymentProviderCredentials {
  // Wave
  wave_api_key?: string
  wave_secret?: string
  
  // Orange Money
  om_client_id?: string
  om_client_secret?: string
  om_merchant_key?: string
  
  // MTN Money
  mtn_user_id?: string
  mtn_api_key?: string
  mtn_subscription_key?: string
  
  // Paystack
  paystack_public_key?: string
  paystack_secret_key?: string
  
  // Stripe
  stripe_publishable_key?: string
  stripe_secret_key?: string
  stripe_webhook_secret?: string
  
  // Flutterwave
  flutterwave_public_key?: string
  flutterwave_secret_key?: string
  flutterwave_encryption_key?: string
  
  // PayPal
  paypal_client_id?: string
  paypal_client_secret?: string
  paypal_mode?: 'sandbox' | 'live'
}

export interface TenantPaymentMode {
  tenant_id: string
  mode: PaymentMode
  since_at: string
  updated_at: string
}

export interface TenantPaymentProvider {
  id: string
  tenant_id: string
  provider: PaymentProvider
  credentials: PaymentProviderCredentials
  active: boolean
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  scope: WalletScope
  scope_id: string
  currency_code: string
  balance_xof: number
  locked_xof: number
  updated_at: string
}

export interface Order {
  id: string
  tenant_id: string
  customer_id?: string
  reference: string
  currency_code: string
  amount_ccy: number
  amount_xof: number
  fx_rate_used: number
  status: PaymentStatus
  created_at: string
  updated_at: string
  payments?: Payment[]
  refunds?: Refund[]
}

export interface Payment {
  id: string
  order_id: string
  provider: PaymentProvider
  channel: PaymentChannel
  currency_code: string
  amount_ccy: number
  amount_xof: number
  fx_rate_used: number
  status: PaymentStatus
  provider_ref?: string
  raw_json?: string
  created_at: string
  updated_at: string
}

export interface Refund {
  id: string
  payment_id?: string
  order_id: string
  amount_xof: number
  reason?: string
  status: PaymentStatus
  created_at: string
  updated_at: string
}

export interface LedgerEntry {
  id: string
  scope: WalletScope
  scope_id: string
  type: LedgerType
  amount_xof: number
  meta_json?: string
  created_at: string
}

export interface PayoutRequest {
  id: string
  tenant_id: string
  request_xof: number
  requested_ccy?: string
  requested_amount?: number
  target_channel: PayoutChannel
  target_details: PayoutTargetDetails
  status: PayoutStatus
  created_by: string
  created_at: string
  reviewed_by?: string
  reviewed_at?: string
  paid_at?: string
  evidence_url?: string
  notes?: string
}

export interface PayoutTargetDetails {
  // Orange Money / MTN Money / Wave
  phone_number?: string
  
  // Bank Transfer
  account_number?: string
  bank_code?: string
  bank_name?: string
  account_name?: string
  iban?: string
  swift_code?: string
  
  // Cash / Check
  pickup_location?: string
  recipient_name?: string
  recipient_id?: string
}

export interface PaymentLimit {
  id: string
  level: PaymentLimitLevel
  max_providers: number
  daily_payout_cap_xof: number
  kyc_required: boolean
  created_at: string
}

export interface TenantPaymentLimit {
  tenant_id: string
  level: PaymentLimitLevel
}

export interface AuditLog {
  id: string
  actor_type: AuditScope
  actor_id: string
  action: string
  entity: string
  entity_id: string
  payload?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface WebhookEvent {
  id: string
  provider: PaymentProvider
  event_type: string
  raw_json: string
  processed: boolean
  created_at: string
}

// API Request/Response Types
export interface CreateOrderRequest {
  tenant_id: string
  customer_id?: string
  items: OrderItem[]
  currency: string
}

export interface OrderItem {
  name: string
  description?: string
  quantity: number
  unit_price: number
}

export interface CheckoutRequest {
  order_id: string
  channel: PaymentChannel
  provider?: PaymentProvider
  source_token?: string
  return_url?: string
  cancel_url?: string
}

export interface PayoutRequestData {
  amount_ccy?: number
  amount_xof?: number
  currency?: string
  target_channel: PayoutChannel
  target_details: PayoutTargetDetails
  notes?: string
}

export interface WalletBalance {
  balance_xof: number
  locked_xof: number
  available_xof: number
  balance_display: number
  currency_display: string
  fx_rate: number
}

export interface LedgerSummary {
  entries: LedgerEntry[]
  total_credits: number
  total_debits: number
  net_balance: number
  period_start: string
  period_end: string
}

// Provider-specific webhook payload types
export interface WaveWebhookPayload {
  event_type: string
  transaction_id: string
  amount: number
  currency: string
  status: string
  reference: string
  created_at: string
}

export interface PaystackWebhookPayload {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    currency: string
    status: string
    created_at: string
    metadata?: Record<string, any>
  }
}

export interface StripeWebhookPayload {
  id: string
  object: string
  type: string
  data: {
    object: {
      id: string
      amount: number
      currency: string
      status: string
      metadata?: Record<string, any>
    }
  }
  created: number
}
