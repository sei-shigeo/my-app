<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getProducts, getProductCategories } from '$lib/api/products.remote';
	import type { ProductCategory, Product } from '$lib/server/db/schema';
	import CustomSelect from './customSelect.svelte';

	let productCategories = $state<ProductCategory[]>([]);
	let products = $state<Product[]>([]);

	// カテゴリデータを読み込む
	async function loadCategories() {
		productCategories = await getProductCategories();
	}

	// 商品データを読み込む
	async function loadProducts() {
		products = await getProducts();
	}

	// 初期化時にデータを読み込む
	loadCategories();
	loadProducts();

	let selectedCategory = $state<number | null>(null);




</script>

<!-- フォーム -->
<form class="flex h-screen w-full items-center justify-center gap-2">
	<CustomSelect
		label={productCategories.find((c) => c.id === selectedCategory)?.name ?? ''}
	/>
	<input type="hidden" name="selectedCategory" bind:value={selectedCategory} />
	<button
		type="submit"
		disabled={!selectedCategory}
		class={[
			'rounded-md bg-blue-500 px-4 py-2 text-white',
			selectedCategory ? 'opacity-100' : 'opacity-50'
		]}>送信</button
	>
</form>
