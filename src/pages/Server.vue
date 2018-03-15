<template>
	<div class="server">
		Server test page: {{ state }}
		<div>

			<button
				@click="startServer({server})"
				:disabled="startDisabled"
			>Start server</button>

			<button
				v-if="hasStoppedServer"
				@click="killServer({server})"
				:disabled="killDisabled"
				key="killServer"
			>Kill server</button>
			<button
				v-else
				@click="stopServer()"
				:disabled="killDisabled"
				key="stopServer"
			>Stop server</button>
		</div>
		<router-link :to="{name: 'ServerConsole', params:{server: server}}">Console</router-link>
		<router-link :to="{name: 'ServerConfig', params:{server: server}}">Config</router-link>
		<router-view/>
		<pre>{{ info }}</pre>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	props: {
		server: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			hasStoppedServer: false,
		};
	},
	computed: {
		hasPendingOperations() {
			return this.$store.state.pendingOperations[this.server] > 0;
		},
		state() {
			return this.$store.state.state[this.server];
		},
		info() {
			return this.$store.state.serverInfo[this.server];
		},
		startDisabled() {
			return this.hasPendingOperations || this.state === 'prepare_start' || this.state === 'started';
		},
		killDisabled() {
			return this.hasPendingOperations || this.state === 'crashed' || this.state === 'stopped';
		},
	},
	watch: {
		state() {
			this.hasStoppedServer = false;
		},
	},
	created() {
		this.$store.dispatch('loadServerInfo', {
			server: this.server,
		});
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
			'killServer',
			'sendCommand',
		]),
		stopServer() {
			for (let i = 0; i < this.info.values.default.shutdownCommands.length; i++) {
				this.sendCommand({
					server: this.server,
					command: this.info.values.default.shutdownCommands[i],
				});
			}
			this.hasStoppedServer = true;
		},
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

