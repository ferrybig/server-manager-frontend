
import * as types from './mutation-types';
import connector from '../api/singleton';
import messageUnsplitter from '../api/messageUnsplitter';

const listenerRegister = {};

export const enableListener = ({ commit }, { server, channel }) => {
	const registerMethod = () => {
		const registration = { count: 1 };
		listenerRegister[server][channel] = registration;
		commit(types.ACTIVATE_MESSAGE_CACHE, {
			server,
			channel,
		});
		let streamHandler = (msg) => {
			if (registration.count > 0) {
				commit(types.RECEIVE_MESSAGE, {
					server,
					channel,
					msg,
				});
			}
		};
		if (channel === 'console') {
			streamHandler = messageUnsplitter(streamHandler);
		}
		registration.connection = connector.getStream(
			server,
			channel,
			streamHandler,
		);
	};
	if (!listenerRegister[server]) {
		listenerRegister[server] = {};
	}
	const registration = listenerRegister[server][channel];
	if (registration) {
		if (registration.count > 0) {
			registration.count += 1;
			return;
		}
		registration.promise.then(registerMethod);
	} else {
		registerMethod();
	}
};
export const disableListener = ({ commit }, { server, channel }) => {
	if (!listenerRegister[server]) {
		listenerRegister[server] = {};
	}
	const registration = listenerRegister[server][channel];
	if (!registration) {
		registration.count -= 1;
		// console.assert(registration.count >= 0);
		if (registration.count <= 0) {
			registration.promise = registration.connection.cancel().then(() => {
				delete listenerRegister[server][channel];
				commit(types.DROP_MESSAGE_CACHE, {
					server,
					channel,
				});
			});
		}
	}
};
export const startServer = ({ commit }, { server }) => {
	commit(types.START_PENDING_OPERATION, {
		server,
	});
	connector.sendAction(server, 'start', '').finally(() => {
		commit(types.STOP_PENDING_OPERATION, {
			server,
		});
	});
};
export const killServer = ({ commit }, { server }) => {
	commit(types.START_PENDING_OPERATION, {
		server,
	});
	connector.sendAction(server, 'kill', '').finally(() => {
		commit(types.STOP_PENDING_OPERATION, {
			server,
		});
	});
};
export const sendCommand = ({ commit }, { server, command }) => {
	commit(types.START_PENDING_OPERATION, {
		server,
	});
	connector.sendAction(server, 'send_command', command).finally(() => {
		commit(types.STOP_PENDING_OPERATION, {
			server,
		});
	});
};
