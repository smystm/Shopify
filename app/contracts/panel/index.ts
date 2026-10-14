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
   /** Snapshot — survives the product being edited or deleted. */
   title: string
   price: number
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
   title: string
   price: number
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
   trade_url: string | null
   permission: Permission | null
   created_at: number | null
   /** Derived from the wallet ledger, never stored. */
   balance: number
}

/** The only fields PATCH /user accepts. */
export interface EditableProfile {
   name?: string
   email?: string
   steam_id?: string
   trade_url?: string
}