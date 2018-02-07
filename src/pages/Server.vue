<template>
	<div class="server">
		Server test page
		<ul style="border: 1px solid black; height: 20em; overflow: scroll;">
			<li
				v-for="(line) in console"
				:key="line.id"
				style="white-space: pre; font-family: monospace"
			>{{ line.msg }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: '',
	components: {

	},

	props: {
		server: {
			type: String,
			required: true,
		},
	},
	data() {
		return {

		};
	},
	computed: {
		console() {
			return this.$store.state.messages.filter(m => m.server === this.server && m.channel === 'console');
		},
	},
	created() {
		this.$store.dispatch('enableListener', {
			server: this.server,
			channel: 'console',
		});
	},
	destroyed() {
		this.$store.dispatch('disableListener', {
			server: this.server,
			channel: 'console',
		});
	},
	methods: {

	},
};
</script>

<style>
</style>

