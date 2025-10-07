<script lang="ts">
	import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from './data.remote';
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';
	import { type Vehicle } from '$lib/server/db/schema';

	let newFormClose = $state(false);
	let editFormClose = $state(false);
	let getVehicle = $state<Vehicle>({} as Vehicle);
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
					<form {...addVehicle} class="flex flex-col gap-2">
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
							<span>numberPlate:</span>
							<input
								type="text"
								name="numberPlate"
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
			<div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
				{#each await getVehicles() as vehicle (vehicle.id)}
					<button
						type="button"
						class="flex items-center gap-4 rounded-md border border-gray-300 p-2"
						onclick={() => {
							editFormClose = true;
							getVehicle = { ...vehicle };
						}}
					>
						<div class="size-16 rounded-md bg-gray-300"></div>
						<ul class="flex flex-col">
							<li class="flex items-center gap-2">
								<span class="iconify mdi--truck-outline"></span>
								<span class="text-sm text-gray-700">{vehicle.name}</span>
							</li>
							<li class="flex items-center gap-2">
								<span class="iconify mdi--numeric"></span>
								<span class="text-sm text-gray-700">{vehicle.numberPlate}</span>
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
							await deleteVehicle(getVehicle.id);
							editFormClose = false;
						}}
					/>
				</div>
			</div>
			<!-- 従業員詳細 テスト用 -->
			<form
				{...updateVehicle.enhance(async ({ submit }) => {
					await submit();
				})}
				class="flex flex-col gap-2"
			>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="id"
						bind:value={getVehicle.id}
						disabled={editFormDisabled}
					/>
				</label>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="name"
						bind:value={getVehicle.name}
						disabled={editFormDisabled}
					/>
				</label>
				<label>
					<input
						class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
						type="text"
						name="numberPlate"
						bind:value={getVehicle.numberPlate}
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
