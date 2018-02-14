
import * as requests from './requests';
import Connector from './connector';

export default class BackendConnector {
	constructor(websocketConnector) {
		this.connector = new Connector(websocketConnector);
	}

	serverList() {
		return this.connector.sendData(requests.SERVER_LIST()).promise;
	}

	serverInfo(server) {
		return this.connector.sendData(requests.SERVER_INFO(server)).promise;
	}

	serverListen(server, channel, stream) {
		return this.connector.sendData(requests.SERVER_LISTEN(server, channel), stream);
	}

	serverAction(server, action, args) {
		return this.connector.sendData(requests.SERVER_ACTION(server, action, args)).promise;
	}
}
