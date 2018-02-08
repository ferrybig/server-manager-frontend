
import debug from 'debug';
import * as requests from './requests';

const logger = {
	debug: debug('servermanager:connector:debug'),
	info: debug('servermanager:connector:log'),
	warn: debug('servermanager:connector:warn'),
	error: debug('servermanager:connector:error'),
};
logger.error.enabled = true;

export default class Connector {
	constructor(websocketConnector) {
		this.websocketConnector = websocketConnector;
		this.wsReady = false;
		this.lastDisconnected = new Date();
		this.receivingQueue = [];
		this.pendingTasks = [];
		this.pendingDelayedTasks = {};
		this.pendingStreamingTasks = {};

		this.connect();
	}
	connect() {
		this.ws = this.websocketConnector();
		this.ws.onopen = (event) => {
			logger.debug('* Connection open: ', event);
			while (this.pendingDelayedTasks.length > 0) {
				const pendingTask = this.pendingDelayedTasks.shift();
				if (!pendingTask.completed) {
					this.pendingTasks.unshift(pendingTask);
				} else {
					pendingTask.resolve();
				}
			}
			while (this.pendingStreamingTasks.length > 0) {
				const pendingTask = this.pendingStreamingTasks.shift();
				if (!pendingTask.completed) {
					this.pendingTasks.unshift(pendingTask);
				} else {
					pendingTask.resolve();
				}
			}
			for (let i = 0; i < this.pendingTasks.length; i++) {
				const pendingTask = this.pendingTasks[i];
				if (pendingTask.request.type === 'killstream') {
					pendingTask.resolv();
					this.pendingTasks.splice(i, 1);
					i -= 1;
				} else if (pendingTask.completed) {
					this.pendingTasks.splice(i, 1);
					i -= 1;
				} else {
					this.sendPendingTask(pendingTask);
				}
			}
			this.wsReady = true;
		};
		this.ws.onmessage = (event) => {
			const parsed = JSON.parse(event.data);
			logger.debug('< ', parsed);
			this.onIncomingData(parsed);
		};
		this.ws.onclose = (event) => {
			logger.error('* Connection close', event);
			this.wsReady = false;
			const now = new Date();

			if (this.lastDisconnected + (10 * 1000) > now) {
				setTimeout(() => this.connect(), 10000);
			} else {
				this.connect();
			}
			this.lastDisconnected = new Date();
		};
	}
	onIncomingData(data) {
		switch (data.type.toLowerCase()) {
		case 'instant':
		{
			const task = this.pendingTasks.shift();
			if (data.success) {
				task.resolve(data.data);
			} else {
				task.reject(new Error(data));
			}
			break;
		}
		case 'delayed':
		{
			const task = this.pendingTasks.shift();
			this.pendingDelayedTasks[data.id] = task;
			break;
		}
		case 'stream':
		{
			const task = this.pendingTasks.shift();
			this.pendingStreamingTasks[data.id] = task;
			task.streamId = data.id;
			if (task.completed) {
				// Directly unsubscribe
				this.killStream(data.id);
			}
			break;
		}
		case 'stream_data':
		{
			const task = this.pendingStreamingTasks[data.id];
			if (task) {
				if (!data.moreData) {
					task.resolve();
					delete this.pendingStreamingTasks[data.id];
				}
				task.stream(data.data);
			} else {
				logger.warn(`Killing unannounced stream: ${data.id}`);
				this.sendData(requests.KILL_STREAM(data.id));
			}
			break;
		}
		case 'stream_end':
		{
			const task = this.pendingStreamingTasks[data.id];
			if (task) {
				task.resolve();
				delete this.pendingStreamingTasks[data.id];
			}
			break;
		}
		case 'delayed_data':
		{
			const task = this.pendingDelayedTasks[data.id];
			delete this.pendingDelayedTasks[data.id];
			if (data.success) {
				task.resolve(data.data);
			} else {
				task.reject(new Error(data));
			}
			break;
		}
		default:
		{
			logger.error('Invalid packet received: ', data);
			break;
		}
		}
	}
	sendPendingTask({ request }) {
		logger.debug('> ', request);
		try {
			this.ws.send(JSON.stringify(request));
		} catch (e) {
			// This is handles through the reconection system
			logger.error(e);
		}
	}
	killStream(id) {
		const task = this.pendingStreamingTasks[id];
		if (task) {
			if (task.isKilled) {
				return;
			}
			task.isKilled = true;
		}
		if (this.wsReady) {
			const kill = this.sendData(requests.KILL_STREAM(id));
			if (task) {
				kill.promise.then(() => {
					delete this.pendingStreamingTasks[id];
					task.resolve();
				});
			}
		} else if (task) {
			delete this.pendingStreamingTasks[id];
			task.resolve();
		}
	}
	sendData(request, stream) {
		const task = {
			request,
			completed: false,
		};
		const returnData = {
			promise: new Promise((resolve, reject) => {
				task.resolve = resolve;
				task.reject = reject;
				this.pendingTasks.push(task);
				if (this.wsReady) {
					this.sendPendingTask(task);
				}
			}),

		};
		task.cancel = () => {
			if (task.completed) {
				return returnData.promise;
			}
			task.completed = true;
			if (task.streamId !== undefined) {
				this.killStream(task.streamId);
			}
			return returnData.promise;
		};
		task.stream = (data) => {
			if (stream) {
				stream(data, returnData);
			} else {
				logger.warn('Received stream data on non stream endpoint: ', request);
				returnData.cancel();
			}
		};
		returnData.then = returnData.promise.then.bind(returnData.promise);
		return returnData;
	}
}
