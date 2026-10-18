import type { Category } from "@/app/contracts/products"
import type { Permission } from "@/app/lib/permissions"

/**
 * Order lifecycle for a skin marketplace. Delivery happens through a Steam
 * trade offer, not a shipment, so these statuses replace the usual
 * pending/shipped/delivered vocabulary.
 */
export type OrderStatus =
   | "pending_payment"
   | "in_escrow"
   | "trade_sent"
   | "completed"
   | "disputed"
   | "refunded"
   | "cancelled"

export const ORDER_STATUSES: OrderStatus[] = [
   "pending_payment",
   "in_escrow",
   "trade_sent",
   "completed",
   "disputed",
   "refunded",
   "cancelled",
]

/** Statuses that mean the order has finished and will not move again. */
export const TERMINAL_ORDER_STATUSES: OrderStatus[] = ["completed", "refunded", "cancelled"]

export type TradeOfferStatus = "pending" | "accepted" | "declined" | "cancelled"
export type TradeOfferDirection = "incoming" | "outgoing"
export type WalletTransactionType = "topup" | "purchase" | "refund"

export interface OrderItem {
   id: number
   order_id: number
   product_id: number | null
   /** Snapshot for a skin; null for a service line. */
   title: string | null
   price: number
   /** 1 for a skin (a unique item); higher for a service line. */
   quantity: number
   /** Service lines only: machine values, labelled via app/lib/orderItems.ts. */
   service: string | null
   variant: string | null
   image: string | null
   created_at: number | null
}

export interface Order {
   id: number
   user_id: number
   status: OrderStatus
   total: number
   created_at: number | null
   updated_at: number | null
   items: OrderItem[]
}

/**
 * The back office's view of one order: the customer-side shape plus the buyer.
 * The suffixes mirror the SQL aliases the backend's admin projections use.
 */
export interface AdminOrder extends Order {
   user_name?: string | null
   user_phone?: string | null
   user_email?: string | null
   user_steam_id?: string | null
   user_trade_url?: string | null
}

export interface OrdersSummary {
   total: number
   byStatus: Partial<Record<OrderStatus, number>>
}

export interface TradeOffer {
   id: number
   order_id: number | null
   user_id: number
   direction: TradeOfferDirection
   status: TradeOfferStatus
   steam_offer_url: string | null
   created_at: number | null
   responded_at: number | null
}

export interface WalletTransaction {
   id: number
   user_id: number
   type: WalletTransactionType
   /** Always positive; `type` decides the direction. */
   amount: number
   reference: string | null
   created_at: number | null
}

export interface WishlistItem {
   id: number
   user_id: number
   product_id: number
   /** User's price-drop alert. Null means "notify me on any change". */
   target_price: number | null
   created_at: number | null
   title: string | null
   /** Joined from the live product, so a deleted product shows null. */
   current_price: number | null
   image: string | null
   category: Category | null
   productNumber: string | null
}

export interface InventoryItem {
   id: number
   product_id: number | null
   /** Snapshot for a skin; null for a service line. */
   title: string | null
   price: number
   /** 1 for a skin; higher for a service line. */
   quantity: number
   /** Service lines only: machine values, labelled via app/lib/orderItems.ts. */
   service: string | null
   variant: string | null
   image: string | null
   order_id: number
   acquired_at: number | null
}

/** The signed-in customer's profile as returned by GET /user and PATCH /user. */
export interface PanelProfile {
   id: number
   name: string | null
   phone: string | null
   email: string | null
   steam_id: string | null
   /** Steam persona picture. Null until the account has a Steam login. */
   avatar: string | null
   trade_url: string | null
   permission: Permission | null
   created_at: number | null
   /** Derived from the wallet ledger, never stored. */
   balance: number
}

/**
 * The only fields PATCH /user accepts.
 *
 * `phone` is deliberately absent: it changes only through a verified code.
 *
 * `name`, `steam_id` and `avatar` are accepted only while the shop is signing
 * people in with a phone number - they are dropped from the server's allow-list
 * automatically once AUTH_PROVIDER=steam, because Steam then owns the identity.
 * They stay here so the form compiles either way.
 */
export interface EditableProfile {
   name?: string
   email?: string
   steam_id?: string
   trade_url?: string
}

/**
 * State of the payment rail, from `GET /payments/config`.
 *
 * The gateway can only ever credit the wallet - it never pays for an order - so
 * this says whether topping up through it is possible yet, not whether orders can
 * be paid for. Orders are paid from the balance either way.
 */
export interface PaymentConfig {
   /** `zarinpal` once connected; `unconfigured` while nothing is plugged in. */
   provider: string
   configured: boolean
   sandbox: boolean
   /** Toman bounds for a single top-up. */
   minTopup: number
   maxTopup: number
}

/**
 * Response from starting a verified phone change.
 *
 * There is deliberately no `code` here: the endpoint must never return the
 * value it is asking the user to prove. The code goes out over SMS (or, in
 * development, the backend terminal).
 */
export interface PhoneChangeRequested {
   verificationId: string
   /** Milliseconds until the challenge expires. */
   expiresIn: number
}