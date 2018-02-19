<template>
	<div class="smf-listing">
		Listing test page
		<router-link :to="{name: 'ServerConsole', params:{server: 'test'}}">test</router-link>
		<router-link :to="{name: 'ServerConsole', params:{server: 'test1'}}">test1</router-link>
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
	},
	created() {

	},
	// Methods
	methods: {

	},
};
</script>

