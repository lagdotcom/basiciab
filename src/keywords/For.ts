import r from '../rendering';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';

export const For: Keyword = {
	name: 'for',
	render(s: Statement) {
		const [v, init, end] = s.args;
		return `FOR ${r(v)} = ${r(init)} TO ${r(end)}`;
	},
};

export const ForStep: Keyword = {
	name: 'for-step',
	render(s: Statement) {
		const [v, init, end, step] = s.args;
		return `FOR ${r(v)} = ${r(init)} TO ${r(end)} STEP ${r(step)}`;
	},
};
