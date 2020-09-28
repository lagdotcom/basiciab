import { parseable } from '../parsing';
import r from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token, { VariableToken } from '../types/Token';

type LetArgs = [v: VariableToken, expr: Token];

function execute(sys: System, s: Statement) {
	const [v, expr] = s.args as LetArgs;
	if (sys.vars.has(v.name)) sys.vars.set(v.name, sys.evaluate(expr));
	else sys.vars.add(v.name, { value: sys.evaluate(expr) });
}

export const Let: Keyword = {
	name: 'let',
	visible: 'LET',
	expression: parseable('LET {var} = {expr}'),
	execute,
	render(s: Statement) {
		const [v, expr] = s.args as LetArgs;
		return `LET ${r(v)} = ${r(expr)}`;
	},
};

export const LetImplicit: Keyword = {
	name: 'let-implicit',
	expression: parseable('{var} = {expr}'),
	execute,
	render(s: Statement) {
		const [v, expr] = s.args as LetArgs;
		return `${r(v)} = ${r(expr)}`;
	},
};
