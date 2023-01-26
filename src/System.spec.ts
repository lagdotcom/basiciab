import {
	DummyDisplay,
	DummyInput,
	FN,
	NUM,
	OP,
	STR,
	simpleProgramParsed,
} from './helpers';

import System from './System';

describe('system', () => {
	it('should evaluate expressions', () => {
		const s = new System(DummyDisplay, DummyInput);

		expect(s.evaluate(OP(NUM(1), '+', NUM(2)))).toEqual(3);
		expect(s.evaluate(OP(STR('a'), '+', STR('b')))).toEqual('ab');
	});

	it('should run functions', () => {
		const s = new System(DummyDisplay, DummyInput);

		expect(s.evaluate(FN('ABS', NUM(-3)))).toEqual(3);
		expect(s.evaluate(FN('INT', NUM(4.2)))).toEqual(4);
	});

	it('can run a simple program', () => {
		const s = new System(DummyDisplay, DummyInput);
		s.add(...simpleProgramParsed);

		s.runToEnd();
		expect(s.vars.get('x')).toEqual(7);
		expect(s.vars.get('t')).toEqual(5);
	});
});
