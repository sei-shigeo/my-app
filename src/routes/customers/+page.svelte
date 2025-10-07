<script lang="ts">
	import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from './data.remote';
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';
	import { type Customer } from '$lib/server/db/schema';

	let newFormClose = $state(false);
	let editFormClose = $state(false);
	let getCustomer = $state<Customer>({} as Customer);
	let editFormDisabled = $state(true);
</script>

<svelte:boundary>
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
				<div class="mb-2">
					<form {...addCustomer} class="flex flex-col gap-2">
						<label class="text-sm text-gray-700">
							<span>name:</span>
							<input
								type="text"
								name="name"
								class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
								autocomplete="name"
							/>
						</label>
						<label class="text-sm text-gray-700">
							<span>email:</span>
							<input
								type="email"
								name="email"
								class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
								autocomplete="off"
							/>
						</label>
						<label class="text-sm text-gray-700">
							<span>phone:</span>
							<input
								type="text"
								name="phone"
								class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
								autocomplete="off"
							/>
						</label>

						<div class="grid grid-cols-[150px_150px] gap-2">
							<Button type="submit" label="作成" icon="iconify mdi--add" />
							<Button type="reset" label="リセット" icon="iconify mdi--refresh" />
						</div>
					</form>
				</div>
			{/if}
			<!-- 顧客一覧 -->
			<div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
				{#each await getCustomers() as customer (customer.id)}
					<button
						type="button"
						class="flex items-center gap-4 rounded-md border border-gray-300 p-2"
						onclick={() => {
							editFormClose = true;
							getCustomer = { ...customer };
						}}
					>
						<div class="size-16 rounded-md bg-gray-300"></div>
						<ul class="flex flex-col">
							<li class="flex items-center gap-2">
								<span class="iconify mdi--truck-outline"></span>
								<span class="text-sm text-gray-700">{customer.name}</span>
							</li>
							<li class="flex items-center gap-2">
								<span class="iconify mdi--numeric"></span>
								<span class="text-sm text-gray-700">{customer.email}</span>
							</li>
							<li class="flex items-center gap-2">
								<span class="iconify mdi--numeric"></span>
								<span class="text-sm text-gray-700">{customer.phone}</span>
							</li>
						</ul>
					</button>
				{/each}
			</div>
		</div>

		<!-- 右サイドバー（編集フォーム） -->
		<div class="h-screen w-3xs border-l border-gray-300 p-2 {!editFormClose ? 'hidden' : ''}">
			<div class="mb-2 flex justify-between gap-2">
				<Button
					icon="iconify mdi--close"
					class="flex rounded-md p-2 transition hover:bg-gray-300"
					onClick={() => (editFormClose = !editFormClose)}
				/>
				<div class="flex gap-2">
					<Button
						label="編集"
						icon="iconify mdi--pencil-outline"
						onClick={() => (editFormDisabled = !editFormDisabled)}
					/>
					<Button
						label="削除"
						icon="iconify mdi--delete-outline"
						onClick={async () => {
							await deleteCustomer(getCustomer.id);
							editFormClose = false;
						}}
					/>
				</div>
			</div>
			<!-- 従業員詳細 テスト用 -->
			<form
				{...updateCustomer.enhance(async ({ submit }) => {
					await submit();
				})}
				class="flex flex-col gap-2"
			>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="id"
						bind:value={getCustomer.id}
						disabled={editFormDisabled}
					/>
				</label>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="name"
						bind:value={getCustomer.name}
						disabled={editFormDisabled}
					/>
				</label>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="email"
						name="email"
						bind:value={getCustomer.email}
						disabled={editFormDisabled}
					/>
				</label>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="phone"
						bind:value={getCustomer.phone}
						disabled={editFormDisabled}
					/>
				</label>
				{#if !editFormDisabled}
					<Button type="submit" label="更新" icon="iconify mdi--update" />
				{/if}
			</form>
		</div>
	</div>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
