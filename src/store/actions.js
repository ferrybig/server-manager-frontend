import debug from 'debug';
import * as types from './mutation-types';
import connector from '../api/singleton';
import messageUnsplitter from '../api/messageUnsplitter';

const logger = Object.freeze({
	info: debug('servermanager:store:actions:info'),
	warn: debug('servermanager:store:actions:warn'),
	error: debug('servermanager:store:actions:error'),
});

const listenerRegister = {};
const runningLoadServerInfo = {};

function errorRecorder(commit, promise) {
	return promise.catch((error) => {
		logger.info('caught exception: ', error);
		commit(types.EXCEPTION_CAUGHT, {
			error,
		});
		throw error;
	});
}

function pendingOperationHandler(commit, args, callable) {
	commit(types.START_PENDING_OPERATION, args);
	return errorRecorder(
		commit,
		Promise.resolve(callable())
			.finally(() => {
				commit(types.STOP_PENDING_OPERATION, args);
			}),
	);
}

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
		registration.connection = connector.serverListen(
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
export const startServer = ({ commit }, { server }) =>
	pendingOperationHandler(
		commit,
		{
			server,
		},
		() => connector.serverAction(server, 'start'),
	);
export const killServer = ({ commit }, { server }) =>
	pendingOperationHandler(
		commit,
		{
			server,
		},
		() => connector.serverAction(server, 'kill'),
	);
export const sendCommand = ({ commit }, { server, command }) =>
	pendingOperationHandler(
		commit,
		{
			server,
		},
		() => connector.serverAction(server, 'send_command', command),
	);
export const serverUpdateProperties = ({ commit }, { server, properties }) =>
	pendingOperationHandler(
		commit,
		{
			server,
		},
		() => connector.serverUpdateProperties(server, properties),
	);
export const loadServerInfo = ({ commit }, { server }) =>
	new Promise((resolve, reject) => {
		const load = () => errorRecorder(commit, connector.serverInfo(server))
			.then((data) => {
				commit(types.UPDATE_SERVER_INFO, {
					server,
					data,
				});
				if (runningLoadServerInfo[server]) {
					runningLoadServerInfo[server].callback();
					runningLoadServerInfo[server] = {};
				} else {
					delete runningLoadServerInfo[server];
				}
				resolve();
			}).catch(e => reject(e));
		if (runningLoadServerInfo[server]) {
			if (!runningLoadServerInfo[server].callback) {
				runningLoadServerInfo[server].callback = load;
			}
		} else {
			load();
		}
	});
