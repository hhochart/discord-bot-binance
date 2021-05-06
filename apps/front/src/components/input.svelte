<script lang="ts">
	export let value = '';
	export let label: string;
	export let name: string;
</script>

<div class="flex flex-col space-y-2 items-start">
	<label for={name}>
		{label} :
	</label>
	<input
		bind:value
		class="px-5 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-4 ring-gray-500"
		{name}
	/>
</div>
