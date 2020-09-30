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
	key: string;
}

interface InputBreakEvent {
	type: 'break';
	key: string;
}

export type BASICInputEvent =
	| InputKeyEvent
	| InputMetaEvent
	| InputBackEvent
	| InputBreakEvent;

export default interface Input {
	events: BASICInputEvent[];
}
