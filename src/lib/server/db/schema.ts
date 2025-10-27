import { pgTable, serial, varchar, integer, timestamp, boolean, smallint, check } from 'drizzle-orm/pg-core';
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
	deletedAt: timestamp('deleted_at'),
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

// 場所マスター(積地、卸地)
export const locations = pgTable('locations', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	address: varchar('address').notNull(),
	deletedAt: timestamp('deleted_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
});
// 配送ルートの各セグメント（積地・卸地の各地点）
export const orderRouteSegments = pgTable('order_route_segments', {
	id: serial('id').primaryKey(),
	orderId: integer('order_id').references(() => orders.id).notNull(),
	segmentType: smallint('segment_type').notNull().default(0), // 0: 積地, 1: 卸地
	sequenceNumber: integer('sequence_number').notNull(), // 順番（1番目の積地、2番目の積地など）
	locationId: integer('location_id').references(() => locations.id), // 場所マスタへの参照
	datetime: timestamp('datetime').notNull(), // 予定日時
	employeeId: integer('employee_id').references(() => employees.id), // 運転手（積地の場合）
	helperEmployeeId: integer('helper_employee_id').references(() => employees.id), // 横乗り運転手
	vehicleId: integer('vehicle_id').references(() => vehicles.id), // 使用車両
	notes: varchar('notes'), // メモ
	deletedAt: timestamp('deleted_at'),
	createdAt: timestamp('created_at').notNull().default(sql`now()`),
	updatedAt: timestamp('updated_at').notNull().default(sql`now()`)
}, (table) => [
	check('segment_type', sql`${table.segmentType} IN (0, 1)`),
]);

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
export type Invoice = typeof invoices.$inferSelect;
export type VehicleSize = typeof vehicleSizes.$inferSelect;
export type VehicleShape = typeof vehicleShapes.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;