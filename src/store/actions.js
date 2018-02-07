
import * as types from './mutation-types';
import connector from '../api/singleton';
import messageUnsplitter from '../api/messageUnsplitter';

const listenerRegister = {};

export const enableListener = ({ commit }, { server, channel }) => {
	console.log(channel);
	const registerMethod = () => {
		const registration = { count: 1 };
		listenerRegister[server][channel] = registration;
		commit(types.ACTIVATE_MESSAGE_CACHE, {
			server,
			channel,
		});
		registration.connection = connector.getStream(
			server,
			channel,
			messageUnsplitter((msg) => {
				if (registration.count > 0) {
					commit(types.RECEIVE_MESSAGE, {
						server,
						channel,
						msg,
					});
				}
			}),
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
