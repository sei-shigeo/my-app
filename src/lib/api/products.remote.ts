import { query } from '$app/server';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';

export const getProducts = query(async () => {
	const productList = await db.select().from(products).orderBy(products.id);
	return productList;
});
