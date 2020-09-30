import { parseable } from '../parsing';
import r from '../rendering';
import System, { SystemState } from '../System';
import { isNum } from '../tools';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token, { VariableToken } from '../types/Token';

function doFor(
	sys: System,
	v: string,
	init: number,
	end: number,
	step: number
) {
	if (sys.vars.has(v)) sys.vars.set(v, init);
	else sys.vars.add(v, { value: init });

	sys.stack.push({
		type: 'for',
		v,
		end,
		step,
		line: sys.line,
		statement: sys.statement,
	});
}

type ForArgs = [v: VariableToken, init: Token, end: Token];
export const For: Keyword = {
	name: 'for',
	visible: 'FOR',
	expression: parseable('FOR {var} = {expr} TO {expr}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('FOR only in programs');

		const [v, ainit, aend] = s.args as ForArgs;
		const init = sys.evaluate(ainit);
		const end = sys.evaluate(aend);
		if (!isNum(init) || !isNum(end)) throw new Error('FOR only uses numbers');

		doFor(sys, v.name, init, end, 1);
	},
	render(s: Statement) {
		const [v, init, end] = s.args as ForArgs;
		return `FOR ${r(v)} = ${r(init)} TO ${r(end)}`;
	},
};

type ForStepArgs = [v: VariableToken, init: Token, end: Token, step: Token];
export const ForStep: Keyword = {
	name: 'for-step',
	expression: parseable('FOR {var} = {expr} TO {expr} STEP {expr}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('FOR only in programs');

		const [v, ainit, aend, astep] = s.args as ForStepArgs;
		const init = sys.evaluate(ainit);
		const end = sys.evaluate(aend);
		const step = sys.evaluate(astep);
		if (!isNum(init) || !isNum(end) || !isNum(step))
			throw new Error('FOR only uses numbers');

		doFor(sys, v.name, init, end, step);
	},
	render(s: Statement) {
		const [v, init, end, step] = s.args as ForStepArgs;
		return `FOR ${r(v)} = ${r(init)} TO ${r(end)} STEP ${r(step)}`;
	},
};
