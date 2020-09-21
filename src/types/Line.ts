import Statement from './Statement';

export default interface Line {
	label: number;
	statements: Statement[];
}
