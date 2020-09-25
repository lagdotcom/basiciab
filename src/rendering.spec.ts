import { assert } from 'chai';
import {
	ST,
	VAR,
	NUM,
	OP,
	simpleProgramLines,
	simpleProgramParsed,
} from './helpers';
import { renderLine, renderStatement } from './rendering';

describe('rendering', () => {
	it('should render a simple program', () => {
		const expected = simpleProgramLines.join('\n');
		const rendered = simpleProgramParsed.map(renderLine).join('\n');

		assert.equal(rendered, expected);
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
