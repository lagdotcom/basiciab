import { assert } from 'chai';
import {
	DummyDisplay,
	DummyInput,
	FN,
	NUM,
	OP,
	simpleProgramParsed,
	STR,
} from './helpers';
import System from './System';

describe('system', () => {
	it('should evaluate expressions', () => {
		const s = new System(DummyDisplay, DummyInput);

		assert.equal(s.evaluate(OP(NUM(1), '+', NUM(2))), 3);
		assert.equal(s.evaluate(OP(STR('a'), '+', STR('b'))), 'ab');
	});

	it('should run functions', () => {
		const s = new System(DummyDisplay, DummyInput);

		assert.equal(s.evaluate(FN('ABS', NUM(-3))), 3);
		assert.equal(s.evaluate(FN('INT', NUM(4.2))), 4);
	});

	it('can run a simple program', () => {
		const s = new System(DummyDisplay, DummyInput);
		s.add(...simpleProgramParsed);

		s.runToEnd();
		assert.equal(s.vars.get('x'), 7);
		assert.equal(s.vars.get('t'), 5);
	});
});
