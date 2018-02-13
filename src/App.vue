<template>
	<div class="app">
		<div class="app__inner">
			<div class="app__account">
				account bar
			</div>
			<router-view/>
		</div>
		<pre>{{ errors }}</pre>
	</div>
</template>

<script>
export default {
	name: 'App',
	computed: {
		errors() {
			return this.$store.state.errors;
		},
	},
};
</script>

<style>
	.app {

	}
	.app__account {
		/*height: 60px;*/
		/*background-color: darkgrey;*/
	}
	.app__inner {
	}
	html, body {

	}
</style>
