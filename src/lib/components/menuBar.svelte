<script lang="ts">
	type MenuItem = {
		href: string;
		icon: string;
		label: string;
	};

	type MenuData = {
		items: MenuItem[];
		options: MenuItem[];
	};

	let { menu }: { menu: MenuData } = $props();

	let menuBarOpen = $state(false);
</script>

<!-- メニューリスト スニペット -->
{#snippet menuList(items: MenuItem[])}
	<ul class="space-y-2">
		{#each items as item}
			<li class="">
				<a
					href={item.href}
					class="flex items-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-300"
				>
					<span class={`${item.icon} mr-3`}></span>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<div class="">
	<button
		class="mb-2 flex w-full items-center p-2 text-lg text-gray-700"
		aria-label="メニューを開く"
		onclick={() => (menuBarOpen = !menuBarOpen)}
	>
		<span class={menuBarOpen ? 'iconify mdi--close' : 'iconify mdi--menu'}></span>
	</button>
	<!-- メニューリスト -->
	{@render menuList(menu.items)}

	<hr class="my-4 border-gray-300" />

	<!-- オプションリスト -->
	{@render menuList(menu.options)}
</div>
