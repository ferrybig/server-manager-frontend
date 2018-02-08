
export default function messageUnsplitter(stream, lineLimit = 100) {
	let buffer = '';
	return function messageUnsplitterIntern(message, ...args) {
		buffer += message;
		const split = buffer.split('\n');
		if (split.length > 1) {
			buffer = split[split.length - 1];
			for (let i = 0; i < split.length - 1; i++) {
				stream(split[i], ...args);
			}
		} else if (buffer.length > lineLimit) {
			stream(buffer, ...args);
			buffer = '';
		}
	};
}
