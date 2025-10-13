<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import { getEmployees, updateEmployee, deleteEmployee } from '../../lib/api/employees.remote';
	import SearchBar from '$lib/components/searchBar.svelte';
	import Button from '$lib/components/button.svelte';
	import CreateForm from './createForm.svelte';
	import { type Employee } from '$lib/server/db/schema';

	let newFormClose = $state(false);
	let editFormClose = $state(false);
	let getEmployee = $state<Employee>({} as Employee);
	let editFormDisabled = $state(true);
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
			<div class="mb-2">
				<CreateForm />
			</div>
		{/if}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
			{#each await getEmployees() as employee (employee.id)}
				<Card
					{...employee}
					onClick={() => {
						editFormClose = true;
						getEmployee = { ...employee };
					}}
				/>
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
						await deleteEmployee(getEmployee.id);
						editFormClose = false;
					}}
				/>
			</div>
		</div>
		<!-- 従業員詳細 テスト用 -->
		<form
			{...updateEmployee.enhance(async ({ submit }) => {
				await submit();
			})}
			class="flex flex-col gap-2"
		>
			<label>
				<input
					class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					type="text"
					name="id"
					bind:value={getEmployee.id}
					disabled={editFormDisabled}
				/>
			</label>
			<label>
				<input
					class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					type="text"
					name="name"
					bind:value={getEmployee.name}
					disabled={editFormDisabled}
				/>
			</label>
			<label>
				<input
					class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					type="text"
					name="email"
					bind:value={getEmployee.email}
					disabled={editFormDisabled}
				/>
			</label>
			<label>
				<input
					class="w-full rounded-md border border-gray-300 p-1 focus:border-gray-400 focus:outline-none"
					type="text"
					name="phone"
					bind:value={getEmployee.phone}
					disabled={editFormDisabled}
				/>
			</label>
			{#if !editFormDisabled}
				<Button type="submit" label="更新" icon="iconify mdi--update" />
			{/if}
		</form>
	</div>
</div>
