
import BackendConnector from './backendConnector';

const connector = new BackendConnector(() => new WebSocket('ws://localhost:8070/websocket'));

export default connector;
