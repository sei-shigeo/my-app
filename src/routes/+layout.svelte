<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import MenuBar from '$lib/components/menuBar.svelte';
	import SearchBar from '$lib/components/searchBar.svelte';
	import EditForm from '$lib/components/editForm.svelte';
	import Button from '$lib/components/button.svelte';
	import CreateForm from './employees/createForm.svelte';

	import { deleteEmployee } from '../routes/employees/data.remote';

	let { children } = $props();

	let menu = {
		items: [
			{ label: 'ダッシュボード', href: '/', icon: 'iconify mdi--view-dashboard-outline' },
			{ label: '従業員管理', href: '/employees', icon: 'iconify mdi--person-outline' },
			{ label: '顧客管理', href: '/customers', icon: 'iconify mdi--building' },
			{ label: '車両管理', href: '/vehicles', icon: 'iconify mdi--truck-outline' },
			{ label: '受注管理', href: '/orders', icon: 'iconify mdi--book-open-page-variant-outline' },
			{ label: '配車管理', href: '/dispatch', icon: 'iconify mdi--book-open-page-variant-outline' },
			{ label: '請求管理', href: '/invoices', icon: 'iconify mdi--book-open-page-variant-outline' }
		],
		options: [
			{ label: '設定', href: '/settings', icon: 'iconify mdi--settings-outline' },
			{ label: 'ログアウト', href: '/logout', icon: 'iconify mdi--logout' }
		]
	};
	let editFormClose = $state(false);
	let newFormClose = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen">
	<!-- サイドバー -->
	<div class="border-r border-gray-300 p-2">
		<MenuBar {menu} />
	</div>

	<!-- メインコンテンツ -->
	<div class="flex-1">
		{@render children?.()}
	</div>

</div>
