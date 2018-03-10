import BackendConnector from './backendConnector';

const connector = new BackendConnector(() => new WebSocket(process.env.BACKEND_URL));

export default connector;
