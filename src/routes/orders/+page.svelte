<script lang="ts">
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';
	import { getOrders, addOrder, updateOrder } from '$lib/api/orders.remote';
	import { getProducts } from '$lib/api/products.remote';
	import { getCustomers } from '$lib/api/customers.remote';
	import { getEmployees } from '$lib/api/employees.remote';
	import { getVehicles } from '$lib/api/vehicles.remote';

	let newFormClose = $state(true);
	let updateFormClose = $state(false);
	let addLocationFormClose = $state(false);
	let startLocationIds = $state([0]);
	let endLocationIds = $state([0]);
	let employeeId = $state('');
	let vehicleId = $state('');
	let endHelperEmployee = $state(false);
	let startHelperEmployee = $state(false);
	let helperEmployeeId = $state('');
	let status = $state(false);

	// テスト用
	let productCategoryId = $state('');
	let vehicleSizeId = $state('');
	let vehicleShapeId = $state('');

	// 商品カテゴリ
	type Category = {
		id: number;
		name: string;
		quantityType: string;
	};

	let categories = $state<Category[]>([
		{ id: 1, name: 'スポット', quantityType: '車' },
		{ id: 2, name: '定期便', quantityType: '便' },
		{ id: 3, name: '常用', quantityType: '車' }
	]);

	// 車両の種類(大きさ)
	type VehicleSize = {
		id: number;
		size: string;
	};

	let vehicleSizes = $state<VehicleSize[]>([
		{ id: 1, size: '小型車' },
		{ id: 2, size: '中型車' },
		{ id: 3, size: '大型車' },
		{ id: 4, size: 'トラクター' }
	]);

	// 車両の形状
	type VehicleShape = {
		id: number;
		shape: string;
	};

	let vehicleShapes = $state<VehicleShape[]>([
		{ id: 1, shape: '低床ウィング' },
		{ id: 2, shape: '高床幌' },
		{ id: 3, shape: '低床平ボデ' },
		{ id: 4, shape: '高床平ボデ' }
	]);
</script>

<div class="flex">
	<div class="flex-1 p-2">
		<!-- ヘッダー（検索バー） -->
		<div class="mb-2 flex items-center justify-between gap-2">
			<SearchBar />
			<Button
				label={newFormClose ? '閉じる' : '新規'}
				icon="iconify mdi--add"
				onClick={() => (newFormClose = !newFormClose)}
			/>
		</div>
		<!-- 作成フォーム  -->
		{#if newFormClose}
			<div class="mb-4">
				<form
					{...addOrder}
					class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
				>
					<!-- ヘッダー：ステータス -->
					<div class="flex items-center gap-4 border-b border-gray-200 pb-3">
						<h3 class="text-base font-semibold text-gray-800">新規配送依頼</h3>
						<label class="cursor-pointer">
							<input
								type="checkbox"
								name="status"
								class="peer sr-only"
								value="true"
								bind:checked={status}
							/>
							<span
								class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition-colors peer-checked:bg-green-100 peer-checked:text-green-700"
							>
								<span class="iconify mdi--truck-outline"></span>
								{#if status}
									確定
								{:else}
									未確定
								{/if}
							</span>
						</label>
					</div>

					<!-- 配送情報セクション -->
					<div class="space-y-3">
						<h4 class="text-sm font-medium text-gray-700">配送情報</h4>
						<div class="grid grid-cols-1 items-center gap-4">
							<!-- 積地情報 セクション -->
							<div class="space-y-3 rounded-md bg-blue-50 p-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-1 text-sm font-medium text-blue-700">
										<span class="iconify mdi--map-marker-outline"></span>
										<span>積地</span>
									</div>
								</div>

								<!-- 顧客＆荷物 セクション -->
								<div class="grid grid-cols-6 gap-2">
									<label class="text-sm text-gray-700">
										<span class="mb-1 block font-medium">顧客</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
											></span>
											<select
												name="customerId"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
											>
												<option value="">顧客を選択</option>
												{#each await getCustomers() as customer (customer.id)}
													<option value={customer.id}>{customer.name}</option>
												{/each}
											</select>
										</div>
									</label>
									<!-- 商品はカテゴリ選択 -->
									<label class="text-sm text-gray-700">
										<span class="mb-1 block font-medium">商品カテゴリ</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--package-variant"
											></span>
											<select
												name="productCategoryId"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
												bind:value={productCategoryId}
											>
												<option value="">カテゴリを選択</option>
												{#each categories as category (category.id)}
													<option value={String(category.id)}>{category.name}</option>
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
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
										<span class="mb-1 block font-medium"
											>数量（{productCategoryId
												? categories.find((category) => category.id === Number(productCategoryId))
														?.quantityType
												: '車'}）</span
										>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--sort-numeric-variant"
											></span>
											<input
												type="number"
												name="quantity"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
												value="1"
												min="1"
											/>
										</div>
									</label>

									<!-- 重量 -->
									<label class="text-sm text-gray-700">
										<span class="mb-1 block font-medium">重量</span>
										<div class="relative">
											<span class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--weight"
											></span>
											<input
												type="number"
												name="weight"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
												value="1"
												min="1"
											/>
										</div>
									</label>


								</div>

								<!-- 運転手＆車両 セクション -->
								<div class="grid grid-cols-6 gap-2">
									<div class="flex-1 text-sm text-gray-700">
										<button
											type="button"
											class={[
												'mb-1 flex w-full items-center text-xs font-medium',
												startHelperEmployee
													? 'hover:after:content-["横乗りを削除"]'
													: 'hover:after:content-["横乗りを追加"]'
											]}
											onclick={() => (startHelperEmployee = !startHelperEmployee)}
										>
											<span>運転手</span>
										</button>
										<!-- 運転手セクション -->
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
											></span>
											<select
												name="employee"
												aria-label="運転手を選択"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												bind:value={employeeId}
											>
												<option value="">運転手を選択</option>
												{#each await getEmployees() as employee (employee.id)}
													<option value={employee.id}>{employee.name}</option>
												{/each}
											</select>
										</div>
									</div>
									<!-- 横乗り運転手セクション -->
									{#if startHelperEmployee}
										<div class="flex-1 text-sm text-gray-700">
											<button
												type="button"
												class="mb-1 flex w-full items-center text-xs font-medium hover:after:content-['を削除']"
												onclick={() => (startHelperEmployee = false)}
											>
												<span>横乗り運転手</span>
											</button>
											<div class="relative">
												<span
													class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
												></span>
												<select
													name="helperEmployee"
													class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
													bind:value={helperEmployeeId}
												>
													<option value="">横乗り選択</option>
													{#each await getEmployees() as employee (employee.id)}
														<option value={employee.id}>{employee.name}</option>
													{/each}
												</select>
											</div>
										</div>
									{/if}
									<!-- 車両の種類 -->
									<label class="flex-1 text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">種類</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
											></span>
											<select
												name="vehicleSize"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												bind:value={vehicleSizeId}
											>
												<option value="">種類を選択</option>
												{#each vehicleSizes as vehicleSize (vehicleSize.id)}
													<option value={vehicleSize.id}>{vehicleSize.size}</option>
												{/each}
											</select>
										</div>
									</label>
									<!-- 車両の形状 -->
									<label class="flex-1 text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">形状</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
											></span>
											<select
												name="vehicleShape"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												bind:value={vehicleShapeId}
											>
												<option value="">形状を選択</option>
												{#each vehicleShapes as vehicleShape (vehicleShape.id)}
													<option value={vehicleShape.id}>{vehicleShape.shape}</option>
												{/each}
											</select>
										</div>
									</label>
									<!-- 車両 -->
									<label class="flex-1 text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">車両</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
											></span>
											<select
												name="vehicle"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												bind:value={vehicleId}
											>
												<option value="">車両を選択</option>
												{#each await getVehicles() as vehicle (vehicle.id)}
													<option value={vehicle.id}>{vehicle.numberPlate}</option>
												{/each}
											</select>
										</div>
									</label>
									{#if Number(vehicleSizeId) === 4}
										<!-- 台車 -->
										<label class="flex-1 text-sm text-gray-700">
											<span class="mb-1 block text-xs font-medium">台車</span>
											<div class="relative">
												<span
													class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
												></span>
												<select
													name="trailer"
													class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												>
													<option value="">台車を選択</option>
													{#each await getVehicles() as vehicle (vehicle.id)}
														<option value={vehicle.id}>{vehicle.numberPlate}</option>
													{/each}
												</select>
											</div>
										</label>
									{/if}
								</div>

								<!-- 出発日＆出発地 セクション -->
								<div class="grid gap-2 rounded-md border border-gray-200 bg-blue-50 p-4">
									{#each startLocationIds as id (id)}
										<div class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2">
											<label class="col-span-1 text-sm text-gray-700">
												<span class="mb-1 block text-xs font-medium">
													積地日時 {startLocationIds.indexOf(id) + 1}
												</span>
												<input
													type="datetime-local"
													name={'startDate' + id}
													class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
													value={(() => {
														const now = new Date();
														const offset = now.getTimezoneOffset();
														const localTime = new Date(now.getTime() - offset * 60 * 1000);
														return localTime.toISOString().slice(0, 16);
													})()}
												/>
											</label>
											<label class="col-span-4 text-sm text-gray-700">
												<span class="mb-1 block text-xs font-medium">
													積地 {startLocationIds.indexOf(id) + 1}
												</span>
												<input
													type="text"
													name={'startLocation' + id}
													placeholder="例: 東京都"
													class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												/>
											</label>
											<!-- 追加・削除ボタン -->
											<div class="flex items-end gap-2">
												<button
													type="button"
													class="h-9 rounded-md bg-blue-500 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
													aria-label="追加"
													onclick={() => {
														const index = startLocationIds.indexOf(id);
														const newId = Math.max(...startLocationIds) + 1;
														startLocationIds = [
															...startLocationIds.slice(0, index + 1),
															newId,
															...startLocationIds.slice(index + 1)
														];
													}}
												>
													<span class="text-sm">追加</span>
												</button>
												<button
													type="button"
													class="h-9 rounded-md bg-red-500 px-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-500"
													disabled={startLocationIds.length <= 1}
													aria-label="削除"
													onclick={() => {
														if (startLocationIds.length > 1) {
															startLocationIds = startLocationIds.filter((itemId) => itemId !== id);
														}
													}}
												>
													<span class="text-sm">削除</span>
												</button>
											</div>
										</div>
										{#if startLocationIds.indexOf(id) < startLocationIds.length - 1}
											<div class="m-0 flex justify-center">
												<span class="iconify text-2xl text-gray-400 mdi--arrow-down-bold"></span>
											</div>
										{/if}
									{/each}
								</div>
							</div>

							<!-- 矢印アイコン（オプション） -->
							<div class="-my-2 flex justify-center">
								<span class="iconify text-2xl text-gray-400 mdi--arrow-down-bold"></span>
							</div>

							<!-- 卸地情報 セクション -->
							<div class="grid gap-2 rounded-md bg-green-50 p-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-1 text-sm font-medium text-green-700">
										<span class="iconify mdi--map-marker"></span>
										<span>卸地</span>
									</div>
								</div>

								<!-- 卸地日時＆卸地 セクション -->
								<div class="grid gap-2 rounded-md border border-gray-200 bg-green-50 p-4">
									{#each endLocationIds as id (id)}
										<div class="grid gap-2 grid-cols-[repeat(6,1fr)_auto_auto]">
											<!-- 運転手 -->
											<label class="col-span-1 text-sm text-gray-700">
												<button
													type="button"
													onclick={() => (endHelperEmployee = !endHelperEmployee)}
													class={[
														'mb-1 flex w-full items-center text-xs font-medium',
														endHelperEmployee
															? 'hover:after:content-["横乗りを削除"]'
															: 'hover:after:content-["横乗りを追加"]'
													]}
												>
													<span>運転手</span>
												</button>
												<div class="relative">
													<span
														class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
													></span>
													<select
														name={'employee' + id}
														aria-label="運転手を選択"
														class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
														value={employeeId}
													>
														<option value="">運転手を選択</option>
														{#each await getEmployees() as employee (employee.id)}
															<option value={employee.id}>{employee.name}</option>
														{/each}
													</select>
												</div>
											</label>
											<!-- 横乗り運転手 -->
											{#if endHelperEmployee || startHelperEmployee}
												<label class="col-span-1 text-sm text-gray-700">
													<button
														type="button"
														class="mb-1 flex w-full items-center text-xs font-medium hover:after:content-['を削除']"
														onclick={() => (endHelperEmployee = false)}
													>
														<span>横乗り運転手</span>
													</button>
													<div class="relative">
														<span
															class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
														></span>
														<select
															name={'helperEmployee' + id}
															class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
															value={helperEmployeeId}
														>
															<option value="">横乗を選択</option>
															{#each await getEmployees() as employee (employee.id)}
																<option value={employee.id}>{employee.name}</option>
															{/each}
														</select>
													</div>
												</label>
											{/if}
											<!-- 車両 -->
											<label class="col-span-1 text-sm text-gray-700">
												<span class="mb-1 block text-xs font-medium">車両</span>
												<div class="relative">
													<span
														class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
													></span>
													<select
														name={'vehicle' + id}
														class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
														value={vehicleId}
													>
														<option value="">車両を選択</option>
														{#each await getVehicles() as vehicle (vehicle.id)}
															<option value={vehicle.id}>{vehicle.numberPlate}</option>
														{/each}
													</select>
												</div>
											</label>

											<!-- 卸地日時 -->
											<label class="col-span-1 text-sm text-gray-700">
												<span class="mb-1 block text-xs font-medium">卸地日時</span>
												<input
													type="datetime-local"
													name={'endDate' + id}
													class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
													value={(() => {
														const now = new Date();
														const offset = now.getTimezoneOffset();
														const localTime = new Date(now.getTime() - offset * 60 * 1000);
														return localTime.toISOString().slice(0, 16);
													})()}
												/>
											</label>

											<!-- 卸地 -->
											<label class="text-sm text-gray-700 col-span-3">
												<span class="mb-1 block text-xs font-medium">
													卸地 {endLocationIds.indexOf(id) + 1}
												</span>
												<input
													type="text"
													name={'endLocation' + id}
													placeholder="例: 大阪府"
													class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
												/>
											</label>

											<!-- 追加・削除ボタン -->
											<div class="flex items-end justify-end gap-2">
												<button
													type="button"
													class="h-9 rounded-md bg-green-500 px-3 text-sm font-medium text-white transition-colors hover:bg-green-600"
													aria-label="追加"
													onclick={() => {
														const index = endLocationIds.indexOf(id);
														const newId = Math.max(...endLocationIds) + 1;
														endLocationIds = [
															...endLocationIds.slice(0, index + 1),
															newId,
															...endLocationIds.slice(index + 1)
														];
													}}
												>
													<span class="text-sm">追加</span>
												</button>
												<button
													type="button"
													class="h-9 rounded-md bg-red-500 px-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-500"
													disabled={endLocationIds.length <= 1}
													aria-label="削除"
													onclick={() => {
														if (endLocationIds.length > 1) {
															endLocationIds = endLocationIds.filter((itemId) => itemId !== id);
														}
													}}
												>
													<span class="text-sm">削除</span>
												</button>
											</div>
										</div>

										<!-- 矢印アイコン（オプション）最後の要素以外の後に表示 -->
										{#if endLocationIds.indexOf(id) < endLocationIds.length - 1}
											<div class="-mt-1 flex justify-center">
												<span class="iconify text-2xl text-gray-400 mdi--arrow-down-bold"></span>
											</div>
										{/if}
									{/each}
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
		{/if}
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
				<button
					type="button"
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
				</button>
			{/each}
		</div>
	</div>
	<!-- 右サイドバー（編集フォーム） -->
	{#if updateFormClose}
		<div class="h-screen w-auto border-l border-gray-300 p-2">
			<div class="mb-4">
				<form
					{...updateOrder}
					class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
				>
					<!-- ヘッダー：ステータス -->
					<div class="flex items-center gap-4 border-b border-gray-200 pb-3">
						<h3 class="text-base font-semibold text-gray-800">配送依頼編集</h3>
						<label class="cursor-pointer">
							<input type="checkbox" name="status" class="peer sr-only" value="true" />
							<span
								class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition-colors peer-checked:bg-green-100 peer-checked:text-green-700"
							>
								<span class="iconify mdi--truck-outline"></span>
								未配車
							</span>
						</label>
					</div>

					<!-- 配送情報セクション -->
					<div class="space-y-3">
						<h4 class="text-sm font-medium text-gray-700">配送情報</h4>
						<div class="grid grid-cols-1 items-center gap-4">
							<!-- 出発情報 -->
							<div class="space-y-3 rounded-md bg-blue-50 p-3">
								<div class="flex items-center gap-1 text-sm font-medium text-blue-700">
									<span class="iconify mdi--map-marker-outline"></span>
									<span>出発</span>
								</div>

								<div class="grid grid-cols-1 gap-2">
									<label class="text-sm text-gray-700">
										<span class="mb-1 block font-medium">顧客</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--person-outline"
											></span>
											<select
												name="customerId"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--sort-numeric-variant"
											></span>
											<input
												type="number"
												name="quantity"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
												value="1"
												min="1"
											/>
										</div>
									</label>
								</div>

								<div class="grid grid-cols-1 gap-2">
									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">運転手</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
											></span>
											<select
												name="employeeUpdate"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">運転手を選択</option>
												{#each await getEmployees() as employee (employee.id)}
													<option value={employee.id}>{employee.name}</option>
												{/each}
											</select>
										</div>
									</label>
									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">車両</span>
										<div class="relative">
											<span
												class="absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400 mdi--car-outline"
											></span>
											<select
												name="vehicleUpdate"
												class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
											>
												<option value="">車両を選択</option>
												{#each await getVehicles() as vehicle (vehicle.id)}
													<option value={vehicle.id}>{vehicle.numberPlate}</option>
												{/each}
											</select>
										</div>
									</label>
								</div>

								<div class="grid grid-cols-1 gap-2">
									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">出発日</span>
										<input
											type="date"
											name="startDateUpdate"
											class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
											value={new Date().toISOString().split('T')[0]}
										/>
									</label>
									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">出発地</span>
										<input
											type="text"
											name="startLocationUpdate"
											placeholder="例: 東京都"
											class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
										/>
									</label>
								</div>
							</div>

							<!-- 矢印アイコン（オプション） -->
							<div class="-my-2 flex justify-center">
								<span class="iconify text-2xl text-gray-400 mdi--arrow-down-bold"></span>
							</div>
							<!-- 到着情報 -->
							<div class="space-y-3 rounded-md bg-green-50 p-3">
								<div class="flex items-center gap-1 text-sm font-medium text-green-700">
									<span class="iconify mdi--map-marker"></span>
									<span>到着</span>
								</div>
								<div class="grid grid-cols-1 gap-2">
									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">到着日</span>
										<input
											type="date"
											name="endDateUpdate"
											class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
											value={new Date().toISOString().split('T')[0]}
										/>
									</label>

									<label class="text-sm text-gray-700">
										<span class="mb-1 block text-xs font-medium">到着地</span>
										<input
											type="text"
											name="endLocationUpdate"
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
						<button
							type="submit"
							class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						>
							<span class="iconify mdi--update"></span>
							<span>更新</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
