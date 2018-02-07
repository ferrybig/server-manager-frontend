import * as types from './mutation-types';

export default {
	[types.RECEIVE_MESSAGE](state, { server, channel, msg }) {
		let firstIndex = -1;
		let count = 0;
		for (let i = state.messages.length - 1; i >= 0; i--) {
			const message = state.messages[i];
			if (message.channel === channel && message.server === server) {
				firstIndex = i;
				count += 1;
			}
		}
		if (count > 20) {
			state.messages.splice(firstIndex, 1);
		}
		state.lastId += 1;
		state.messages.push({
			id: state.lastId,
			msg,
			server,
			channel,
		});
	},
	[types.ACTIVATE_MESSAGE_CACHE]() {

	},
	[types.DROP_MESSAGE_CACHE](state, { server, channel }) {
		for (let i = state.messages.length - 1; i >= 0; i--) {
			const message = state.messages[i];
			if (message.channel === channel && message.server === server) {
				state.messages.splice(i, 1);
			}
		}
	},
};

