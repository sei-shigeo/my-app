import { db } from '$lib/server/db';
import { orders, customers, products } from '$lib/server/db/schema';
import { query, form } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { createInsertSchema } from 'drizzle-zod';

// INSERT用スキーマ（新規作成時）
const insertOrderSchema = createInsertSchema(orders, {
	customerId: z.coerce.number(),
	productId: z.coerce.number(),
	quantity: z.coerce.number(),
	startLocation: z.string(),
	endLocation: z.string(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	status: z.coerce.boolean()
});

// SELECT用スキーマ（取得データの検証）
// const selectOrderSchema = createSelectSchema(orders);

// UPDATE用スキーマ（更新時）
// const updateOrderSchema = insertOrderSchema.extend({
// 	id: z.number()
// });

// 全注文データを取得
export const getOrders = query(async () => {
	const orderList = await db
		.select({
			id: orders.id,
			quantity: orders.quantity,
			startLocation: orders.startLocation,
			endLocation: orders.endLocation,
			startDate: orders.startDate,
			endDate: orders.endDate,
			status: orders.status,
			customerName: customers.name,
			productName: products.name,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt
		})
		.from(orders)
		.leftJoin(customers, eq(orders.customerId, customers.id))
		.leftJoin(products, eq(orders.productId, products.id))
		.orderBy(orders.id);
	return orderList;
});

// 注文データを追加
export const addOrder = form(insertOrderSchema, async (data) => {
	await db.insert(orders).values(data);
	getOrders().refresh();
	redirect(303, '/orders');
});

// 注文データを更新
export const updateOrder = form(insertOrderSchema, async (data) => {
	await db.update(orders).set(data).where(eq(orders.id, data.id));
	getOrders().refresh();
	redirect(303, '/orders');
});