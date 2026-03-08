
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'cancelled';

CREATE POLICY "Users can update own orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
