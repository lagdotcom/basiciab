import System from '../System';

export default interface Display {
	attach(sys: System): void;
	bs(): void;
	cls(): void;
	line(x1: number, y1: number, x2: number, y2: number): void;
	nl(): void;
	pos: number;
	update(): void;
	write(s: string): void;
	writenl(s: string): void;
}
