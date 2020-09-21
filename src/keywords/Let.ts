import r from '../rendering';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';

export const Let: Keyword = {
	name: 'let',
	render(s: Statement) {
		const [v, expr] = s.args;
		return `LET ${r(v)} = ${r(expr)}`;
	},
};

export const LetImplicit: Keyword = {
	name: 'let-implicit',
	render(s: Statement) {
		const [v, expr] = s.args;
		return `${r(v)} = ${r(expr)}`;
	},
};
