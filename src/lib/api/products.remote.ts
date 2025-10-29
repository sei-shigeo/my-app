import { query } from '$app/server';
import { db } from '$lib/server/db';
import { products, productCategories } from '$lib/server/db/schema';

// 商品を取得
export const getProducts = query(async () => {
	const productList = await db.select().from(products).orderBy(products.id);
	return productList;
});

// 商品カテゴリを取得
export const getProductCategories = query(async () => {
	const productCategoryList = await db
		.select()
		.from(productCategories)
		.orderBy(productCategories.id);
	return productCategoryList;
});
