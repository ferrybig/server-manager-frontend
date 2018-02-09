<template>
	<div class="server">
		<div class="console">
			<div class="console__pusher">
				<div class="console__pusher-helper">
					<br
						v-for="i in consoleLines"
						:key="i"
					>
				</div>
			</div>
			<ul class="console__list">
				<li
					v-for="(line) in console"
					:key="line.id"
					class="console__line"
				>{{ line.msg }}</li>
			</ul>
		</div>
		<input
			type="text"
			v-model="command"
		>
		<button
			@click="submitCommand()"
			:disabled="hasPendingOperations"
		>Send command</button>
		<select v-model="consoleLines">
			<option
				v-for="(i) in consoleLinesChooses"
				:value="i"
				:key="i"
			>{{ i }}</option>
		</select>
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
			command: '',
			consoleLines: 20,
		};
	},
	computed: {
		console() {
			return this.$store.state.messages.filter(m => m.server === this.server && m.channel === 'console');
		},
		hasPendingOperations() {
			return this.$store.state.pendingOperations[this.server] > 0;
		},
		consoleLinesChooses() {
			const list = [];
			let i = 20;
			while (i > 0) {
				list.push(i);
				i = Math.floor(i / 1.5);
			}
			return list;
		},
	},
	created() {
	},
	destroyed() {
	},
	methods: {

		...mapActions([
			'sendCommand',
		]),
		submitCommand() {
			this.sendCommand({ server: this.server, command: this.command });
			this.command = '';
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

