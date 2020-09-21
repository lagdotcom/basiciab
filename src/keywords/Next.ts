import r from '../rendering';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';

export const Next: Keyword = {
	name: 'next',
	render(s: Statement) {
		const [v] = s.args;
		return `NEXT ${r(v)}`;
	},
};

export const NextImplicit: Keyword = {
	name: 'next-implicit',
	render() {
		return 'NEXT';
	},
};
