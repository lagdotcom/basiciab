interface InputKeyEvent {
	type: 'key';
	key: string;
}

interface InputMetaEvent {
	type: 'meta';
	key: string;
}

interface InputBackEvent {
	type: 'back';
}

export type BASICInputEvent = InputKeyEvent | InputMetaEvent | InputBackEvent;

export default interface Input {
	events: BASICInputEvent[];
}
