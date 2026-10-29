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
  created_at: string;
}

type OrderRow = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  "id" | "products" | "total" | "status" | "address" | "created_at"
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
    created_at: row.created_at,
  };
}

export function asOrders(rows: OrderRow[] | null): Order[] {
  return (rows ?? []).flatMap((row) => {
    const order = asOrder(row);
    return order ? [order] : [];
  });
}
