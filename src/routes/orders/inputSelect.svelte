<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	/**
	 * @param label ラベル
	 * @param name 名前
	 * @param icon アイコン
	 * @param value バインド値
	 */
	type InputSelectProps = {
		label: string;
		name: string;
		icon: string;
		value?: string;
		class?: string;
		children: Snippet;
	} & HTMLAttributes<HTMLSelectElement>;

	let {
		label,
		name,
		icon,
		value = $bindable(),
		children,
		...selectAttrs
	}: InputSelectProps = $props();
</script>

<div class="text-gray-700">
	<span class="mb-1 block text-xs font-medium">{label}</span>
	<div class="relative">
		<span class={['absolute top-1/2 left-2 iconify -translate-y-1/2 text-gray-400', icon]}></span>
		<select
			class="w-full rounded-md border border-gray-300 bg-white px-8 py-2 text-sm focus:border-blue-500 focus:outline-none"
			{...selectAttrs}
			{name}
			bind:value
		>
			<option value="">{label}を選択</option>
			{@render children()}
		</select>
	</div>
</div>
