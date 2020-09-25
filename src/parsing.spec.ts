import { assert } from 'chai';
import {
	LINE,
	ST,
	NUM,
	VAR,
	OP,
	simpleProgramLines,
	simpleProgramParsed,
} from './helpers';
import parse, { isValidVariableName } from './parsing';

describe('parsing', () => {
	it('can decide what a valid variable name is', () => {
		assert.isTrue(isValidVariableName('hello'));
		assert.isTrue(isValidVariableName('a$'));
		assert.isTrue(isValidVariableName('_this7SUCKS'));
		assert.isFalse(isValidVariableName('3invalid'));
		assert.isFalse(isValidVariableName('aname?'));
	});

	it('can parse a simple statement', () => {
		assert.deepStrictEqual(
			parse('X = 3'),
			ST('let-implicit', VAR('X'), NUM(3))
		);

		// assert.deepStrictEqual(
		// 	parse('10 LET X=3+2*Y'),
		// 	LINE(10, ST('let', VAR('X'), OP(NUM(3), '+', OP(NUM(2), '*', VAR('Y')))))
		// );
	});

	it('can parse a simple program', () => {
		const lines = simpleProgramLines.map(parse);
		assert.deepStrictEqual(lines, simpleProgramParsed);
	});
});
