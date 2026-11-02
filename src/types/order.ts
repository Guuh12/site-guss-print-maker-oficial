import type { Database } from "@/integrations/supabase/types";

export interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  products: OrderProduct[] | null;
  total: number;
  status: string;
  address: string | null;
  shipping_method: string | null;
  shipping_cost: number | null;
  shipping_deadline: string | null;
  payment_method: string | null;
  payment_id: string | null;
  payment_status: string | null;
  created_at: string;
}

type OrderRow = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  "id" | "products" | "total" | "status" | "address" | "created_at"
> &
  Partial<
    Pick<
      Database["public"]["Tables"]["orders"]["Row"],
      | "shipping_method"
      | "shipping_cost"
      | "shipping_deadline"
      | "payment_method"
      | "payment_id"
      | "payment_status"
    >
  >;

export function orderItems(products: unknown): OrderProduct[] {
  return Array.isArray(products) ? products : [];
}

export function canCancelOrder(status: string) {
  return status === "pending" || status === "in_production";
}

export function asOrder(row: OrderRow | null): Order | null {
  if (!row) return null;
  return {
    id: row.id,
    products: orderItems(row.products),
    total: row.total,
    status: row.status,
    address: row.address,
    shipping_method: row.shipping_method ?? null,
    shipping_cost: row.shipping_cost ?? null,
    shipping_deadline: row.shipping_deadline ?? null,
    payment_method: row.payment_method ?? null,
    payment_id: row.payment_id ?? null,
    payment_status: row.payment_status ?? null,
    created_at: row.created_at,
  };
}

export function asOrders(rows: OrderRow[] | null): Order[] {
  return (rows ?? []).flatMap((row) => {
    const order = asOrder(row);
    return order ? [order] : [];
  });
}
