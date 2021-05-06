<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let type: string;

	function handleClick(e) {
		dispatch('click', e);
	}
</script>

<button
	type={type ?? ''}
	class="px-5 py-2 bg-white text-gray-800 rounded focus:outline-none focus:ring-4 ring-gray-500"
	on:click|preventDefault={handleClick}
>
	<slot />
</button>
