<script lang="ts">
	import { onMount } from 'svelte';
	import qs from 'query-string';

	import Button from '../components/button.svelte';
	import Input from '../components/input.svelte';
	let publicApiKey = '';
	let privateApiKey = '';

	onMount(() => {
		console.log(qs.parse(location.search));
	});

	async function handleSubmit() {
		if (!publicApiKey || !privateApiKey) {
			alert('Please fill in the form');
			return;
		}

		console.log(location.search);

		const { user } = qs.parse(location.search);
		if (!user) {
			console.error('No user id found in qs');
			return;
		}

		const res = await fetch('/index.json', {
			method: 'POST',
			body: JSON.stringify({ publicApiKey, privateApiKey, user })
		});

		console.log(res);
	}
</script>

<svelte:head>
	<title>[Login] - Binance Discord bot</title>
</svelte:head>

<section class="space-y-10">
	<h1 class="text-3xl text-center">Binance discord bot Login</h1>

	<form class="flex flex-col items-center justify-center space-y-5" on:submit={handleSubmit}>
		<Input bind:value={publicApiKey} label="Votre clé Binance public" name="binance_public_key" />

		<Input bind:value={privateApiKey} label="Votre clé Binance privé" name="binance_private_key" />

		<Button type="submit" on:click={handleSubmit}>Envoyer</Button>
	</form>
</section>
