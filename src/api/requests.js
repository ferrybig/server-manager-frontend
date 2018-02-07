
export const ACTION = function ACTION(server, action, args) {
	return {
		type: 'action',
		action,
		arguments: args,
		server,
	};
};
export const INFO = function INFO(server) {
	return {
		type: 'info',
		server,
	};
};
export const REGISTER_CHANNEL = function REGISTER_CHANNEL(server, channel) {
	return {
		type: 'register_channel',
		channelName: channel,
		server,
	};
};
export const KILL_STREAM = function KILL_STREAM(streamId) {
	return {
		type: 'kill_stream',
		id: streamId,
	};
};
