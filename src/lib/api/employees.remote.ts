import { query, form, command } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { employees } from '$lib/server/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// INSERT用スキーマ（新規作成時）
const insertEmployeeSchema = createInsertSchema(employees, {
	name: (schema) => schema.min(1, '名前を入力してください'),
	email: (schema) => schema.email('正しいメールアドレスを入力してください'),
	phone: (schema) => schema.min(1, '電話番号を入力してください')
});

// SELECT用スキーマ（取得データの検証）
const selectEmployeeSchema = createSelectSchema(employees);

// UPDATE用スキーマ（更新時）
const updateEmployeeSchema = insertEmployeeSchema.extend({
	id: z.coerce.number().positive()
});

// 従業員データを取得
export const getEmployees = query(async () => {
	const employeeList = await db.select().from(employees).orderBy(employees.id);
	// 必要に応じて取得データを検証
	return employeeList.map((emp) => selectEmployeeSchema.parse(emp));
});

// 従業員データを取得
export const getEmployeeById = query(z.number(), async (id: number) => {
	const [employee] = await db.select().from(employees).where(eq(employees.id, id));
	return employee;
});

// 従業員データを追加
export const addEmployee = form(insertEmployeeSchema, async (data) => {
	await db.insert(employees).values(data);
	getEmployees().refresh();
	redirect(303, '/employees');
});

// 従業員データを更新
export const updateEmployee = form(updateEmployeeSchema, async (data) => {
	await db.update(employees).set(data).where(eq(employees.id, data.id));
	getEmployees().refresh();
});

// 従業員データを削除
export const deleteEmployee = command(z.number(), async (id: number) => {
	await db.delete(employees).where(eq(employees.id, id));
	getEmployees().refresh();
});
