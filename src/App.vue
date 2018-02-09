<template>
	<div class="app">
		<div class="app__inner">
			<div class="app__account">
				account bar
			</div>
			<router-view/>
		</div>
	</div>
</template>

<script>
export default {
	name: 'App',
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
