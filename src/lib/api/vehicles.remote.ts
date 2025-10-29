import { query, form, command } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { vehicles, vehicleSizes, vehicleShapes } from '$lib/server/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';

// INSERT用スキーマ（新規作成時）
const insertVehicleSchema = createInsertSchema(vehicles, {
	name: (schema) => schema.min(1, '名前を入力してください'),
	numberPlate: (schema) => schema.min(1, '車両番号を入力してください')
});

// SELECT用スキーマ（取得データの検証）
const selectVehicleSchema = createSelectSchema(vehicles);

const selectVehicleSizeSchema = createSelectSchema(vehicleSizes);
const selectVehicleShapeSchema = createSelectSchema(vehicleShapes);

// UPDATE用スキーマ（更新時）
const updateVehicleSchema = insertVehicleSchema.extend({
	id: z.coerce.number().positive()
});

// 車両データを取得
export const getVehicles = query(async () => {
	const vehicleList = await db.select().from(vehicles).orderBy(vehicles.id);
	// 必要に応じて取得データを検証
	return vehicleList.map((veh) => selectVehicleSchema.parse(veh));
});

// 種類＆形状で一致する車両データを取得
export const getVehiclesBySizeAndShape = query(
	z.object({ sizeId: z.number(), shapeId: z.number() }),
	async ({ sizeId, shapeId }) => {
		const vehicleList = await db
			.select()
			.from(vehicles)
			.where(and(eq(vehicles.sizeId, sizeId), eq(vehicles.shapeId, shapeId)))
			.orderBy(vehicles.id);
		// 必要に応じて取得データを検証
		return vehicleList.map((veh) => selectVehicleSchema.parse(veh));
	}
);

// 車両データを取得
export const getVehicleById = query(z.number(), async (id: number) => {
	const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
	return vehicle;
});

// 車両データを追加
export const addVehicle = form(insertVehicleSchema, async (data) => {
	await db.insert(vehicles).values(data);
	getVehicles().refresh();
	redirect(303, '/vehicles');
});

// 車両データを更新
export const updateVehicle = form(updateVehicleSchema, async (data) => {
	await db.update(vehicles).set(data).where(eq(vehicles.id, data.id));
	getVehicles().refresh();
});

// 車両データを削除
export const deleteVehicle = command(z.number(), async (id: number) => {
	await db.delete(vehicles).where(eq(vehicles.id, id));
	getVehicles().refresh();
});

// 車両の種類(大きさ)を取得
export const getVehicleSizes = query(async () => {
	const vehicleSizeList = await db.select().from(vehicleSizes).orderBy(vehicleSizes.id);
	return vehicleSizeList.map((size) => selectVehicleSizeSchema.parse(size));
});

// 車両の形状を取得
export const getVehicleShapes = query(async () => {
	const vehicleShapeList = await db.select().from(vehicleShapes).orderBy(vehicleShapes.id);
	return vehicleShapeList.map((shape) => selectVehicleShapeSchema.parse(shape));
});
