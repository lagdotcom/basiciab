import Vars, { Var } from './Vars';

describe('vars', () => {
	it('should let you declare vars', () => {
		const v = new Vars();

		expect(v.has('a')).toBeFalsy();
		v.add('a', { value: 2 });
		expect(v.has('a')).toBeTruthy();
		expect(v.get('a')).toEqual(2);
		expect(v.get('A')).toEqual(2);
	});

	it('should let you change vars', () => {
		const v = new Vars();

		v.add('b', { value: 3 });
		expect(v.get('b')).toEqual(3);
		v.set('b', 12);
		expect(v.get('b')).toEqual(12);
	});

	it('should let you define custom getters', () => {
		const v = new Vars();

		v.add('c', { value: 0, get: () => 3 });
		expect(v.get('c')).toEqual(3);
		v.set('c', 12);
		expect(v.get('c')).toEqual(3);
	});

	it('should let you define custom setters', () => {
		const v = new Vars();

		v.add('p', {
			value: 10,
			set: (v: Var<number>, value: number) =>
				(v.value = Math.min(100, Math.max(0, value))),
		});
		v.set('p', -10);
		expect(v.get('p')).toEqual(0);
		v.set('p', 200);
		expect(v.get('p')).toEqual(100);
	});
});
