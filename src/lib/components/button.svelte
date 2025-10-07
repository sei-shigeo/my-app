<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonProps = {
		label?: string;
		type?: string;
		icon: string;
		class?: ClassValue;
		onClick?: () => void;
	} & HTMLButtonAttributes;

	// デフォルトのスタイル設定
	const defaultClasses =
		'flex items-center justify-center rounded-md bg-gray-300 px-2 py-1.5 gap-2 text-sm hover:bg-gray-400 transition-colors';

	let {
		type = 'button',
		icon,
		label,
		class: className = defaultClasses,
		onClick,
		...props
	}: ButtonProps = $props();
</script>

<button {...props} class={className} onclick={onClick}>
	<span class={icon}></span>
	<span>{label}</span>
</button>
