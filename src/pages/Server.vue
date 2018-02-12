<template>
	<div class="server">
		Server test page: {{ state }}
		<div>

			<button
				@click="startServer({server})"
				:disabled="hasPendingOperations"
			>Start server</button>
			<button
				@click="stopServer({server})"
				:disabled="hasPendingOperations"
			>Kill server</button>
		</div>
		<router-view/>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

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
		hasPendingOperations() {
			return this.$store.state.pendingOperations[this.server] > 0;
		},
		state() {
			return this.$store.state.state[this.server];
		},
	},
	created() {
		this.$store.dispatch('enableListener', {
			server: this.server,
			channel: 'console',
		});
		this.$store.dispatch('enableListener', {
			server: this.server,
			channel: 'state',
		});
	},
	destroyed() {
		this.$store.dispatch('disableListener', {
			server: this.server,
			channel: 'console',
		});
		this.$store.dispatch('disableListener', {
			server: this.server,
			channel: 'state',
		});
	},
	methods: {

		...mapActions([
			'startServer',
			'stopServer',
		]),
	},
};
</script>

<style>
	.console {
		position: relative;
		border: 1px solid black;
		font-family: monospace
	}
	.console__pusher {
		overflow: scroll;
		visibility: hidden;
	}
	.console__pusher-helper {
		pointer-events: none;
	}
	.console__list {
		overflow: scroll;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0;
		padding: 0;
	}
	.console-line {
		white-space: pre;
		list-style: none;
	}
</style>

