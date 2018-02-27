import Vue from 'vue';
import * as types from './mutation-types';

export default {
	[types.RECEIVE_MESSAGE](state, { server, channel, msg }) {
		if (channel === 'console') {
			const messages = state.messages[server];
			if (messages.length > 40) {
				messages.splice(0, 1);
			}
			state.lastId += 1;
			messages.push({
				id: state.lastId,
				msg,
				server,
			});
		} else if (channel === 'state') {
			state.state[server] = msg;
		}
	},
	[types.ACTIVATE_MESSAGE_CACHE](state, { server, channel }) {
		if (channel === 'console') {
			Vue.set(state.messages, server, []);
		} else if (channel === 'state') {
			Vue.set(state.state, server, undefined);
		}
	},
	[types.DROP_MESSAGE_CACHE](state, { server, channel }) {
		if (channel === 'console') {
			state.messages[server] = undefined;
		} else if (channel === 'state') {
			Vue.set(state.state, server, undefined);
		}
	},
	[types.STOP_PENDING_OPERATION](state, { server }) {
		state.pendingOperations[server] -= 1;
	},
	[types.START_PENDING_OPERATION](state, { server }) {
		if (!state.pendingOperations[server]) {
			Vue.set(state.pendingOperations, server, 1);
		} else {
			state.pendingOperations[server] += 1;
		}
	},
	[types.EXCEPTION_CAUGHT](state, { error }) {
		state.errors.push({
			error,
			message: error.message,
			stack: error.stack,
		});
	},
	[types.UPDATE_SERVER_INFO](state, { server, data }) {
		Vue.set(state.serverInfo, server, data);
	},
	[types.SERVER_LIST_RECEIVED](state, { list }) {
		state.serverList = list;
	},
};

