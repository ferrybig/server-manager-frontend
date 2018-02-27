
export const SERVER_ACTION = function SERVER_ACTION(server, action, args) {
	return {
		type: 'server_action',
		action,
		arguments: args,
		server,
	};
};
export const SERVER_INFO = function SERVER_INFO(server) {
	return {
		type: 'server_info',
		server,
	};
};
export const SERVER_LISTEN = function SERVER_LISTEN(server, channel) {
	return {
		type: 'server_listen',
		channelName: channel,
		server,
	};
};
export const SERVER_UPDATE_PROPERTIES = function SERVER_UPDATE_PROPERTIES(server, properties) {
	return {
		type: 'server_update_properties',
		server,
		properties,
	};
};
export const SERVER_LIST = function SERVER_LIST() {
	return {
		type: 'server_list',
	};
};
export const KILL_STREAM = function KILL_STREAM(streamId) {
	return {
		type: 'kill_stream',
		id: streamId,
	};
};
