
import * as requests from './requests';
import Connector from './connector';

export default class BackendConnector {
	constructor(websocketConnector) {
		this.connector = new Connector(websocketConnector);
	}

	getInfo(server) {
		return this.connector.sendData(requests.INFO(server)).promise;
	}

	getStream(server, channel, stream) {
		return this.connector.sendData(requests.REGISTER_CHANNEL(server, channel), stream);
	}

	sendAction(server, action, args) {
		return this.connector.sendData(requests.ACTION(server, action, args)).promise;
	}
}
