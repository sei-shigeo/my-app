<script lang="ts">
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';
	import { getOrders, addOrder } from '$lib/api/orders.remote';
	import { getProducts } from '$lib/api/products.remote';
	import { getCustomers } from '$lib/api/customers.remote';
	import { getEmployees } from '$lib/api/employees.remote';
	import { getVehicles } from '$lib/api/vehicles.remote';

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
		<div class="mb-4">
			<form {...addOrder} class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
				<!-- ヘッダー：ステータス -->
				<div class="flex items-center gap-4 border-b border-gray-200 pb-3">
					<h3 class="text-base font-semibold text-gray-800">新規配送依頼</h3>
					<label class="cursor-pointer">
						<input
							type="checkbox"
							name="status"
							class="peer sr-only"
							value="true"
						/>
						<span
							class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition-colors peer-checked:bg-green-100 peer-checked:text-green-700"
						>
							<span class="iconify mdi--truck-outline"></span>
							未配車
						</span>
					</label>
				</div>

				<!-- 基本情報セクション -->
				<div class="space-y-3">
					<h4 class="text-sm font-medium text-gray-700">基本情報</h4>
					<div class="grid grid-cols-3 gap-3">
						<!-- 顧客選択 -->
						<label class="text-sm text-gray-700">
							<span class="mb-1 block font-medium">顧客</span>
							<div class="relative">
								<span
									class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
								></span>
								<select
									name="customerId"
									class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								>
									<option value="">顧客を選択</option>
									{#each await getCustomers() as customer (customer.id)}
										<option value={customer.id}>{customer.name}</option>
									{/each}
								</select>
							</div>
						</label>

						<!-- 商品選択 -->
						<label class="text-sm text-gray-700">
							<span class="mb-1 block font-medium">商品</span>
							<div class="relative">
								<span
									class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--package-variant"
								></span>
								<select
									name="productId"
									class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								>
									<option value="">商品を選択</option>
									{#each await getProducts() as product (product.id)}
										<option value={product.id}>{product.name}</option>
									{/each}
								</select>
							</div>
						</label>

						<!-- 数量 -->
						<label class="text-sm text-gray-700">
							<span class="mb-1 block font-medium">数量（車）</span>
							<div class="relative">
								<span
									class="mdi--sort-numeric-variant absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400"
								></span>
								<input
									type="number"
									name="quantity"
									class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									value="1"
									min="1"
								/>
							</div>
						</label>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<!-- 運転手 -->
					<label class="text-sm text-gray-700">
						<span class="mb-1 block font-medium">運転手</span>
						<div class="relative">
							<span
								class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
							></span>
							<select
								name="employee"
								class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							>
								<option value="">運転手を選択</option>
								{#each await getEmployees() as employee (employee.id)}
									<option value={employee.id}>{employee.name}</option>
								{/each}
							</select>
						</div>
					</label>
					<!-- 車両 -->
					<label class="text-sm text-gray-700">
						<span class="mb-1 block font-medium">車両</span>
						<div class="relative">
							<span
								class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
							></span>
							<select
								name="vehicle"
								class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							>
								<option value="">車両を選択</option>
								{#each await getVehicles() as vehicle (vehicle.id)}
									<option value={vehicle.id}>{vehicle.numberPlate}</option>
								{/each}
							</select>
						</div>
					</label>
				</div>
				<!-- 配送情報セクション -->
				<div class="space-y-3">
					<h4 class="text-sm font-medium text-gray-700">配送情報</h4>
					<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
						<!-- 出発情報 -->
						<div class="space-y-3 rounded-md bg-blue-50 p-3">
							<div class="flex items-center gap-1 text-sm font-medium text-blue-700">
								<span class="iconify mdi--map-marker-outline"></span>
								<span>出発</span>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<label class="text-sm text-gray-700">
									<span class="mb-1 block text-xs font-medium">出発日</span>
									<input
										type="date"
										name="startDate"
										class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
										value={new Date().toISOString().split('T')[0]}
									/>
								</label>
								<label class="text-sm text-gray-700">
									<span class="mb-1 block text-xs font-medium">出発地</span>
									<input
										type="text"
										name="startLocation"
										placeholder="例: 東京都"
										class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									/>
								</label>
							</div>
						</div>

						<!-- 矢印アイコン（オプション） -->
						<div class="-my-2 flex justify-center">
							<span class="iconify text-2xl text-gray-400 mdi--arrow-right-bold"></span>
						</div>
						<!-- 到着情報 -->
						<div class="space-y-3 rounded-md bg-green-50 p-3">
							<div class="flex items-center gap-1 text-sm font-medium text-green-700">
								<span class="iconify mdi--map-marker"></span>
								<span>到着</span>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<label class="text-sm text-gray-700">
									<span class="mb-1 block text-xs font-medium">到着日</span>
									<input
										type="date"
										name="endDate"
										class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
										value={new Date().toISOString().split('T')[0]}
									/>
								</label>

								<label class="text-sm text-gray-700">
									<span class="mb-1 block text-xs font-medium">到着地</span>
									<input
										type="text"
										name="endLocation"
										placeholder="例: 大阪府"
										class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									/>
								</label>
							</div>
						</div>
					</div>
				</div>

				<!-- ボタンエリア -->
				<div class="flex gap-3 border-t border-gray-200 pt-4">
					<Button type="submit" label="作成" icon="iconify mdi--check" />
					<Button type="reset" label="リセット" icon="iconify mdi--refresh" />
				</div>
			</form>
		</div>
		<!-- {/if} -->
		<!-- 受注一覧 テーブル -->
		<div class="grid grid-cols-8 gap-4">
			<!-- ヘッダー -->
			<div class="col-span-8 grid grid-cols-subgrid rounded-lg bg-gray-500 p-3 text-white">
				<div class="text-sm font-semibold">顧客</div>
				<div class="text-sm font-semibold">商品</div>
				<div class="text-sm font-semibold">数量</div>
				<div class="text-sm font-semibold">出発地</div>
				<div class="text-sm font-semibold">到着地</div>
				<div class="text-sm font-semibold">出発日</div>
				<div class="text-sm font-semibold">到着日</div>
				<div class="text-sm font-semibold">ステータス</div>
			</div>

			<!-- データ行 -->
			{#each await getOrders() as data (data.id)}
				<div
					class="col-span-8 grid grid-cols-subgrid items-center rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
				>
					<div class="text-sm">{data.customerName}</div>
					<div class="text-sm">{data.productName}</div>
					<div class="text-sm">{data.quantity}</div>
					<div class="text-sm">{data.startLocation}</div>
					<div class="text-sm">{data.endLocation}</div>
					<div class="text-sm text-gray-600">
						{new Date(data.startDate).toLocaleDateString('ja-JP')}
					</div>
					<div class="text-sm text-gray-600">
						{new Date(data.endDate).toLocaleDateString('ja-JP')}
					</div>
					<div>
						{#if data.status}
							<span
								class="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
							>
								配車済み
							</span>
						{:else}
							<span
								class="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
							>
								未配車
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
