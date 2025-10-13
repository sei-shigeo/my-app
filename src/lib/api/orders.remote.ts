import { db } from '$lib/server/db';
import { orders, customers, products } from '$lib/server/db/schema';
import { query, form } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
export const addOrder = form(async (data) => {
	await db.insert(orders).values(data);
	getOrders().refresh();
	redirect(303, '/orders');
});
