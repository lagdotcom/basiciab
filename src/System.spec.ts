import { assert } from 'chai';
import { FN, NUM, OP, simpleProgramParsed, STR } from './helpers';
import System from './System';

describe('system', () => {
	const display = {
		attach() {},
		update() {},
		write() {},
	};

	it('should evaluate expressions', () => {
		const s = new System(display);

		assert.equal(s.evaluate(OP(NUM(1), '+', NUM(2))), 3);
		assert.equal(s.evaluate(OP(STR('a'), '+', STR('b'))), 'ab');
	});

	it('should run functions', () => {
		const s = new System(display);

		assert.equal(s.evaluate(FN('ABS', NUM(-3))), 3);
		assert.equal(s.evaluate(FN('INT', NUM(4.2))), 4);
	});

	it('can run a simple program', () => {
		const s = new System(display);
		s.add(...simpleProgramParsed);

		s.run();
		assert.equal(s.vars.get('x'), 7);
		assert.equal(s.vars.get('t'), 5);
	});
});
