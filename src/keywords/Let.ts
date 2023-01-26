import Token, { VariableToken } from '../types/Token';
import { isNum, isStr } from '../tools';

import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import System from '../System';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

type LetArgs = [v: VariableToken, expr: Token];

function execute(sys: System, s: Statement) {
	const [v, expr] = s.args as LetArgs;
	const value = sys.evaluate(expr);

	if (v.name.substr(-1) === '$') {
		if (!isStr(value))
			throw new Error('Cannot store number in string variable');
	} else if (!isNum(value))
		throw new Error('Cannot store string in number variable');

	if (sys.vars.has(v.name)) sys.vars.set(v.name, value);
	else sys.vars.add(v.name, { value });
}

export const Let: Keyword = {
	name: 'let',
	visible: 'LET',
	expression: parseSyntax('LET {var} = {expr}'),
	execute,
	render(s: Statement) {
		const [v, expr] = s.args as LetArgs;
		return `LET ${r(v)} = ${r(expr)}`;
	},
};

export const LetImplicit: Keyword = {
	name: 'let-implicit',
	expression: parseSyntax('{var} = {expr}'),
	execute,
	render(s: Statement) {
		const [v, expr] = s.args as LetArgs;
		return `${r(v)} = ${r(expr)}`;
	},
};
