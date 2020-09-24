import { assert } from 'chai';
import Vars, { Var } from './Vars';

describe('vars', () => {
	it('should let you declare vars', () => {
		const v = new Vars();

		assert.isFalse(v.has('a'));
		v.add('a', { value: 2 });
		assert.isTrue(v.has('a'));
		assert.equal(v.get('a'), 2);
		assert.equal(v.get('A'), 2);
	});

	it('should let you change vars', () => {
		const v = new Vars();

		v.add('b', { value: 3 });
		assert.equal(v.get('b'), 3);
		v.set('b', 12);
		assert.equal(v.get('b'), 12);
	});

	it('should let you define custom getters', () => {
		const v = new Vars();

		v.add('c', { value: 0, get: () => 3 });
		assert.equal(v.get('c'), 3);
		v.set('c', 12);
		assert.equal(v.get('c'), 3);
	});

	it('should let you define custom setters', () => {
		const v = new Vars();

		v.add('p', {
			value: 10,
			set: (v: Var<number>, value: number) =>
				(v.value = Math.min(100, Math.max(0, value))),
		});
		v.set('p', -10);
		assert.equal(v.get('p'), 0);
		v.set('p', 200);
		assert.equal(v.get('p'), 100);
	});
});
