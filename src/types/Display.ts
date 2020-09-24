import System from '../System';

export default interface Display {
	attach(sys: System): void;
	update(): void;
	write(s: string): void;
}
