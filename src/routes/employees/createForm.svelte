<script lang="ts">
	import Button from '../../lib/components/button.svelte';
	import { addEmployee } from '../../lib/api/employees.remote';
</script>

<form {...addEmployee} class="flex flex-col gap-2" >

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
			autocomplete="email"
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
