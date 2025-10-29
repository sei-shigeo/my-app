<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getProducts, getProductCategories } from '$lib/api/products.remote';
	import type { ProductCategory, Product } from '$lib/server/db/schema';

	import type { Snippet } from 'svelte';

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
	let isOpen = $state(false);
	let dropdownElement: HTMLDivElement;

	// ドロップダウンを開く/閉じる
	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// カテゴリを選択
	function selectCategory(id: number) {
		selectedCategory = id;
		isOpen = false;
	}

	// 外部クリック検出
	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// クリックイベントリスナーを追加
	if (typeof window !== 'undefined') {
		window.addEventListener('click', handleClickOutside);
	}

	// コンポーネント破棄時にイベントリスナーを削除
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('click', handleClickOutside);
		}
	});

	const { label }: { label: string } = $props();
</script>

<div>
	<div class="relative w-48" bind:this={dropdownElement}>
		{@render selected(label)}
		{@render options()}
	</div>
</div>

<!-- 表示部分 -->
{#snippet selected(label: string)}
	<button
		type="button"
		class="flex w-full items-center justify-between rounded border border-gray-300 bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
		onclick={toggleDropdown}
	>
		<span class="flex-1 truncate">
			{selectedCategory ? label : 'カテゴリを選択'}
		</span>
		<span
			class={[
				'iconify shrink-0 text-gray-600 transition-transform duration-200 mdi--chevron-down',
				isOpen ? 'rotate-180' : ''
			]}
		></span>
	</button>
{/snippet}

{#snippet options()}
	{#if isOpen}
		<div class="absolute top-12 w-full rounded-md border border-gray-300 bg-white">
			{#each productCategories as category (category.id)}
				<button
					type="button"
					class="flex w-full items-center justify-between gap-2 bg-transparent px-3 py-2 text-left transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
					onclick={() => selectCategory(category.id)}
				>
					<span class="flex-1">{category.name}</span>
					{#if selectedCategory === category.id}
						<span class="iconify shrink-0 text-blue-600 mdi--check"></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
{/snippet}
