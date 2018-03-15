<template>
	<div class="smf-listing">
		Listing test page
		<button @click="fetchData()">
			Refresh
		</button>
		<fieldset
			v-for="(server, key) in list"
			:key="key"
		>
			<legend>{{ key }}</legend>
			<pre>{{ server }}</pre>
			<router-link :to="{name: 'ServerConsole', params: {server: key}}">
				{{ server.name }}
			</router-link>
		</fieldset>
	</div>
</template>

<script>
export default {
	name: 'SmfListing',
	computed: {
		list() {
			return this.$store.state.serverList;
		},
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.$store.dispatch('serverList');
		},
	},
};
</script>

