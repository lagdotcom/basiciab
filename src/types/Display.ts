import System from '../System';

export default interface Display {
	attach(sys: System): void;
	bs(): void;
	nl(): void;
	update(): void;
	write(s: string): void;
}
