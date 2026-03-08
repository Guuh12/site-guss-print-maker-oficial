
DROP POLICY "Users can update own orders" ON public.orders;

CREATE POLICY "Users can cancel own pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status IN ('pending', 'in_production'))
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');
