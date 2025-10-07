import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// 従業員テーブル
export const employees = pgTable('employees', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull()
});

// 顧客テーブル
export const customers = pgTable('customers', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull()
});

// 車両テーブル
export const vehicles = pgTable('vehicles', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	numberPlate: text('number_plate').notNull().unique()
});

// 商品テーブル
export const products = pgTable('products', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

// 受注テーブル
export const orders = pgTable('orders', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id').references(() => customers.id),
	product: text('product').notNull(),
	quantity: integer('quantity').notNull().default(1),
	startLocation: text('start_location').notNull(),
	endLocation: text('end_location').notNull(),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	status: text('status').notNull()
});

// 配車テーブル
export const dispatchs = pgTable('dispatchs', {
	id: serial('id').primaryKey(),
	orderId: integer('order_id').references(() => orders.id),
	employeeId: integer('employee_id').references(() => employees.id),
	vehicleId: integer('vehicle_id').references(() => vehicles.id)
});

// 請求テーブル
export const invoices = pgTable('invoices', {
	id: serial('id').primaryKey(),
	orderId: integer('order_id').references(() => orders.id)
});

// 型定義
export type Employee = typeof employees.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Dispatch = typeof dispatchs.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
