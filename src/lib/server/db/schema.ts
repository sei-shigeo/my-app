import { pgTable, serial, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 従業員テーブル
export const employees = pgTable('employees', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	phone: varchar('phone').notNull()
});

// 顧客テーブル
export const customers = pgTable('customers', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	phone: varchar('phone').notNull()
});

// 車両の種類(大きさ)
export const vehicleSizes = pgTable('vehicle_sizes', {
	id: serial('id').primaryKey(),
	size: varchar('size').notNull()
});

// 車両の形状
export const vehicleShapes = pgTable('vehicle_shapes', {
	id: serial('id').primaryKey(),
	shape: varchar('shape').notNull()
});

// 車両テーブル
export const vehicles = pgTable('vehicles', {
	id: serial('id').primaryKey(),
	sizeId: integer('size_id').references(() => vehicleSizes.id).notNull().default(1),
	shapeId: integer('shape_id').references(() => vehicleShapes.id).notNull().default(1),
	name: varchar('name').notNull(),
	numberPlate: varchar('number_plate').notNull().unique(),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
});

// 品名カテゴリ
export const productCategories = pgTable('product_categories', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	quantityType: varchar('quantity_type').notNull()
});


// 品名テーブル
export const products = pgTable('products', {
	id: serial('id').primaryKey(),
	categoryId: integer('category_id').references(() => productCategories.id).notNull().default(1),
	name: varchar('name').notNull()
});

// 受注テーブル
export const orders = pgTable('orders', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id').references(() => customers.id),
	productId: integer('product_id').references(() => products.id),
	quantity: integer('quantity').notNull().default(1),
	weight: integer('weight').notNull().default(0),
	startLocation: varchar('start_location').notNull(),
	endLocation: varchar('end_location').notNull(),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	status: boolean('status').notNull().default(false),
	deletedAt: timestamp('deleted_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
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
export type VehicleSize = typeof vehicleSizes.$inferSelect;
export type VehicleShape = typeof vehicleShapes.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;