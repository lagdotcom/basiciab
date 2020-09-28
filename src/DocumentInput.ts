import Input, { BASICInputEvent } from './types/Input';

const metaKeys = [
	'Alt',
	'AltGraph',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowUp',
	'CapsLock',
	'Clear',
	'ContextMenu',
	'Control',
	'Delete',
	'End',
	'Enter',
	'Home',
	'Insert',
	'NumLock',
	'PageDown',
	'PageUp',
	'Shift',
];

export default class DocumentInput implements Input {
	events: BASICInputEvent[];

	constructor() {
		document.addEventListener('keydown', this.keypress.bind(this));

		this.events = [];
	}

	keypress(e: KeyboardEvent) {
		if (e.key === 'Backspace') this.events.push({ type: 'back' });
		else if (metaKeys.includes(e.key))
			this.events.push({ type: 'meta', key: e.key });
		else this.events.push({ type: 'key', key: e.key });

		e.preventDefault();
	}
}
