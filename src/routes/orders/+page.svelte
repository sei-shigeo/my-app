<script lang="ts">
	// import { addOrder } from './data.remote';
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';

	let newFormClose = $state(false);
</script>

<div class="flex">
	<div class="flex-1 p-2">
		<!-- ヘッダー（検索バー） -->
		<div class="mb-2 flex items-center justify-between gap-2">
			<SearchBar />
		</div>
		<!-- 作成フォーム  -->
		<!-- {#if newFormClose} -->
		<div class="mb-2">
			<form class="flex flex-col gap-2">
				<!-- 顧客選択 -->
				<label class="text-sm text-gray-700">
					<span>顧客:</span>
					<select
						name="customer"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					>
						<option value="1">顧客1</option>
						<option value="2">顧客2</option>
						<option value="3">顧客3</option>
					</select>
				</label>
				<!-- 商品選択 -->
				<label class="text-sm text-gray-700">
					<span>商品:</span>
					<select
						name="product"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					>
						<option value="1">商品1</option>
						<option value="2">商品2</option>
						<option value="3">商品3</option>
					</select>
				</label>
				<!-- 数量 -->
				<label class="text-sm text-gray-700">
					<span>数量:</span>
					<input
						type="number"
						name="quantity"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						value="1"
					/>
				</label>
				<!-- 出発地 -->
				<label class="text-sm text-gray-700">
					<span>出発地:</span>
					<input
						type="text"
						name="startLocation"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					/>
				</label>
				<!-- 到着地 -->
				<label class="text-sm text-gray-700">
					<span>到着地:</span>
					<input
						type="text"
						name="endLocation"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					/>
				</label>
				<!-- 出発日 -->
				<label class="text-sm text-gray-700">
					<span>出発日:</span>
					<input
						type="date"
						name="startDate"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					/>
				</label>
				<!-- 到着日 -->
				<label class="text-sm text-gray-700">
					<span>到着日:</span>
					<input
						type="date"
						name="endDate"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					/>
				</label>
				<!-- ステータス -->
				<label class="text-sm text-gray-700">
					<span>ステータス:</span>
					<input
						type="text"
						name="status"
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						value="未配車"
					/>
				</label>

				<div class="grid grid-cols-[150px_150px] gap-2">
					<Button type="submit" label="作成" icon="iconify mdi--add" />
					<Button type="reset" label="リセット" icon="iconify mdi--refresh" />
				</div>
			</form>
		</div>
		<!-- {/if} -->
		<!-- 受注一覧 テーブル -->
		<div class="grid grid-cols-1 rounded-md border border-gray-300">
			<!-- 	header		 -->
			<div class="grid grid-cols-8 rounded-t-md border-b border-gray-300">
				<p class="p-2 text-sm text-gray-700">顧客</p>
				<p class="p-2 text-sm text-gray-700">商品</p>
				<p class="p-2 text-sm text-gray-700">数量</p>
				<p class="p-2 text-sm text-gray-700">出発地</p>
				<p class="p-2 text-sm text-gray-700">到着地</p>
				<p class="p-2 text-sm text-gray-700">出発日</p>
				<p class="p-2 text-sm text-gray-700">到着日</p>
				<p class="p-2 text-sm text-gray-700">ステータス</p>
			</div>
			<!-- 	body		 -->
			<div class="grid grid-cols-8">
				<p class="p-2 text-sm text-gray-700">丸杉安城支店</p>
				<p class="p-2 text-sm text-gray-700">リンゴ</p>
				<p class="p-2 text-sm text-gray-700">10</p>
				<p class="p-2 text-sm text-gray-700">安城</p>
				<p class="p-2 text-sm text-gray-700">大阪</p>
				<p class="p-2 text-sm text-gray-700">2025-01-01</p>
				<p class="p-2 text-sm text-gray-700">2025-01-02</p>
				<p class="p-2 text-sm text-gray-700">未配車</p>
			</div>
		</div>
	</div>
</div>
