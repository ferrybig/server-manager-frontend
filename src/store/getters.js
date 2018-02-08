
export const currentMessages = state => state.messages;

export const totalPendingOperations = state =>
	Object.values(state.pendingOperations).reduce((a, b) => a + b, 0);

