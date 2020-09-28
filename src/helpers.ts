import Display from './types/Display';
import Input from './types/Input';
import Line from './types/Line';
import Statement from './types/Statement';
import Token, {
	BinaryOp,
	BinaryToken,
	FnToken,
	NumberToken,
	StringToken,
	VariableToken,
} from './types/Token';

export const LINE = (label: number, ...statements: Statement[]): Line => ({
	label,
	statements,
});
export const ST = (keyword: string, ...args: Token[]): Statement => ({
	label: null,
	keyword,
	args,
});
export const VAR = (name: string): VariableToken => ({
	type: 'variable',
	name,
});
export const NUM = (value: number): NumberToken => ({ type: 'number', value });
export const STR = (value: string): StringToken => ({ type: 'string', value });
export const FN = (name: string, ...args: Token[]): FnToken => ({
	type: 'fn',
	name,
	args,
});
export const OP = (left: Token, op: BinaryOp, right: Token): BinaryToken => ({
	type: 'binary',
	op,
	args: [left, right],
});

export const simpleProgramLines = [
	'10 t = 0 : LET a = 2',
	'20 FOR x = ABS(a - 1) TO 5 STEP 3',
	'30 t = t + x',
	'40 NEXT',
];
export const simpleProgramParsed = [
	LINE(10, ST('let-implicit', VAR('t'), NUM(0)), ST('let', VAR('a'), NUM(2))),
	LINE(
		20,
		ST(
			'for-step',
			VAR('x'),
			FN('ABS', OP(VAR('a'), '-', NUM(1))),
			NUM(5),
			NUM(3)
		)
	),
	LINE(30, ST('let-implicit', VAR('t'), OP(VAR('t'), '+', VAR('x')))),
	LINE(40, ST('next-implicit')),
];

export const DummyDisplay: Display = {
	attach() {},
	bs() {},
	line() {},
	nl() {},
	update() {},
	write() {},
	pos: 0,
};
export const DummyInput: Input = { events: [] };
