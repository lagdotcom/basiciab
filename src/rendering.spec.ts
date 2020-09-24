import { assert } from 'chai';
import { renderLine, renderStatement } from './rendering';
import Line from './types/Line';
import Statement from './types/Statement';
import Token, {
	BinaryOp,
	BinaryToken,
	FnToken,
	NumberToken,
	VariableToken,
} from './types/Token';

const LINE = (label: number, ...statements: Statement[]) => ({
	label,
	statements,
});
const ST = (keyword: string, ...args: Token[]): Statement => ({
	keyword,
	args,
});
const VAR = (name: string): VariableToken => ({ type: 'variable', name });
const NUM = (value: number): NumberToken => ({ type: 'number', value });
const FN = (name: string, ...args: Token[]): FnToken => ({
	type: 'fn',
	name,
	args,
});
const OP = (left: Token, op: BinaryOp, right: Token): BinaryToken => ({
	type: 'binary',
	op,
	args: [left, right],
});

describe('rendering', () => {
	it('should render a simple program', () => {
		const expected = [
			'10 t = 0 : LET a = 2',
			'20 FOR x = ABS(a - 1) TO 5 STEP 3',
			'30 t = t + x',
			'40 NEXT',
		].join('\n');
		const lines: Line[] = [
			LINE(
				10,
				ST('let-implicit', VAR('t'), NUM(0)),
				ST('let', VAR('a'), NUM(2))
			),
			LINE(
				20,
				ST(
					'for-step',
					VAR('x'),
					FN('abs', OP(VAR('a'), '-', NUM(1))),
					NUM(5),
					NUM(3)
				)
			),
			LINE(30, ST('let-implicit', VAR('t'), OP(VAR('t'), '+', VAR('x')))),
			LINE(40, ST('next-implicit')),
		];

		assert.equal(lines.map(renderLine).join('\n'), expected);
	});

	it('should not mangle operator precedence', () => {
		assert.equal(
			renderStatement(
				ST(
					'let-implicit',
					VAR('a'),
					OP(OP(NUM(1), '+', NUM(2)), '*', OP(NUM(3), '-', NUM(4)))
				)
			),
			'a = (1 + 2) * (3 - 4)'
		);
	});
});
