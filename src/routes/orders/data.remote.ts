import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { query, form } from '$app/server';
import { redirect } from '@sveltejs/kit';

// 全注文データを取得
export const getOrders = query(async () => {
  const orderList = await db.select().from(orders).orderBy(orders.id);
  return orderList;
})

// 注文データを追加
export const addOrder = form(async (data) => {
  await db.insert(orders).values(data);
  getOrders().refresh();
  redirect(303, '/orders');
});