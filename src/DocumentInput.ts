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
	'Pause',
	'Shift',
];

export default class DocumentInput implements Input {
	events: BASICInputEvent[];

	constructor() {
		document.addEventListener('keydown', this.keypress.bind(this));

		this.events = [];
	}

	keypress(e: KeyboardEvent) {
		const key = e.key;

		if (key === 'Backspace') this.events.push({ type: 'back', key });
		else if (key === 'Pause') this.events.push({ type: 'break', key });
		else if (metaKeys.includes(key)) this.events.push({ type: 'meta', key });
		else this.events.push({ type: 'key', key });

		e.preventDefault();
	}
}
