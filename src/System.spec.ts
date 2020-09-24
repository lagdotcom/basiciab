import { assert } from 'chai';
import { FN, LINE, NUM, OP, ST, STR, VAR } from './helpers';
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

		assert.equal(s.evaluate(FN('abs', NUM(-3))), 3);
		assert.equal(s.evaluate(FN('int', NUM(4.2))), 4);
	});

	it('can run a simple program', () => {
		const s = new System(display);
		s.add(
			...[
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
			]
		);

		s.run();
		assert.equal(s.vars.get('x'), 7);
		assert.equal(s.vars.get('t'), 5);
	});
});
