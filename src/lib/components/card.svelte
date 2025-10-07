<script lang="ts">
	type CardProps = {
		name: string;
		email: string;
		phone: string;
		onClick?: () => void;
	};

	let { name, email, phone, onClick }: CardProps = $props();
</script>

{#snippet profile(icon: string, label: string)}
	<li class="flex items-center gap-2">
		<span class="iconify {icon}"></span>
		<span class="text-sm text-gray-700">{label}</span>
	</li>
{/snippet}

<button type="button" class="flex items-center gap-4 rounded-md border border-gray-300 p-2" onclick={onClick}>
	<div class="size-16 rounded-md bg-gray-300"></div>
	<ul class="flex flex-col">
		{@render profile('mdi--person-outline', name)}
		{@render profile('mdi--email-outline', email)}
		{@render profile('mdi--phone-outline', phone)}
	</ul>
</button>
