import { query, form, command } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { customers } from '$lib/server/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// INSERT用スキーマ（新規作成時）
const insertCustomerSchema = createInsertSchema(customers, {
	name: (schema) => schema.min(1, '名前を入力してください'),
	numberPlate: (schema) => schema.min(1, '車両番号を入力してください')
});

// SELECT用スキーマ（取得データの検証）
const selectCustomerSchema = createSelectSchema(customers);

// UPDATE用スキーマ（更新時）
const updateCustomerSchema = insertCustomerSchema.extend({
	id: z.coerce.number().positive()
});

// 全データを取得
export const getCustomers = query(async () => {
	const customerList = await db.select().from(customers).orderBy(customers.id);
	// 必要に応じて取得データを検証
	return customerList.map((cust) => selectCustomerSchema.parse(cust));
});

// データを取得
export const getCustomerById = query(z.number(), async (id: number) => {
	const [customer] = await db.select().from(customers).where(eq(customers.id, id));
	return customer;
});

// データを追加
export const addCustomer = form(insertCustomerSchema, async (data) => {
	await db.insert(customers).values(data);
	getCustomers().refresh();
	redirect(303, '/customers');
});

// データを更新
export const updateCustomer = form(updateCustomerSchema, async (data) => {
	await db.update(customers).set(data).where(eq(customers.id, data.id));
	getCustomers().refresh();
});

// データを削除
export const deleteCustomer = command(z.number(), async (id: number) => {
	await db.delete(customers).where(eq(customers.id, id));
	getCustomers().refresh();
});
