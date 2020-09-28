import System from '../System';

export default interface Display {
	attach(sys: System): void;
	bs(): void;
	nl(): void;
	pos: number;
	update(): void;
	write(s: string): void;
}
