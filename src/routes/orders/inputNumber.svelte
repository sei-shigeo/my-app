<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type InputNumberProps = {
		label: string;
		icon: string;
		name: string;
	} & HTMLInputAttributes;

	let { label, icon, min = 1, value = 1, ...inputAttrs }: InputNumberProps = $props();
</script>

<label class="text-sm text-gray-700">
	<span class="mb-1 block text-xs font-medium">{label}</span>
	<div class="relative">
		<span class={['absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400', icon]}></span>
		<input
			type="number"
			{min}
			{value}
			class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
			{...inputAttrs}
		/>
	</div>
</label>
