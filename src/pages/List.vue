<template>
	<div class="smf-listing">
		Listing test page
		<fieldset
			v-for="(server, key) in list"
			:key="server"
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
	components: {

	},
	data() {
		return {

		};
	},
	computed: {
		list() {
			return this.$store.state.serverList;
		},
	},
	created() {
		this.$store.dispatch('serverList');
	},
	// Methods
	methods: {

	},
};
</script>

