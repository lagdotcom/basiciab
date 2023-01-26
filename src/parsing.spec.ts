import {
	NUM,
	ST,
	VAR,
	simpleProgramLines,
	simpleProgramParsed,
} from './helpers';
import parse, { isValidVariableName } from './parsing';

describe('parsing', () => {
	it('can decide what a valid variable name is', () => {
		expect(isValidVariableName('hello')).toBeTruthy();
		expect(isValidVariableName('a$')).toBeTruthy();
		expect(isValidVariableName('_this7SUCKS')).toBeTruthy();
		expect(isValidVariableName('3invalid')).toBeFalsy();
		expect(isValidVariableName('aname?')).toBeFalsy();
	});

	it('can parse a simple statement', () => {
		expect(parse('X = 3')).toStrictEqual(ST('let-implicit', VAR('X'), NUM(3)));

		// assert.deepStrictEqual(
		// 	parse('10 LET X=3+2*Y'),
		// 	LINE(10, ST('let', VAR('X'), OP(NUM(3), '+', OP(NUM(2), '*', VAR('Y')))))
		// );
	});

	it('can parse a simple program', () => {
		const lines = simpleProgramLines.map(parse);
		expect(lines).toStrictEqual(simpleProgramParsed);
	});
});
