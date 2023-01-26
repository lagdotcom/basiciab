import System, { SystemState } from '../System';
import Token, { VariableToken } from '../types/Token';

import { ForClause } from '../types/Clause';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import { isNum } from '../tools';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

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
	expression: parseSyntax('FOR {var} = {expr} TO {expr}'),
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
	expression: parseSyntax('FOR {var} = {expr} TO {expr} STEP {expr}'),
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

function doNext(sys: System, clause: ForClause) {
	var value = sys.vars.get(clause.v) as number;
	value += clause.step;
	if (clause.step > 0 && value > clause.end) sys.stack.pop();
	else if (clause.step < 0 && value < clause.end) sys.stack.pop();
	else {
		sys.line = clause.line;
		sys.statement = clause.statement;
	}

	sys.vars.set(clause.v, value);
}

type NextArgs = [v: VariableToken];
export const Next: Keyword = {
	name: 'next',
	visible: 'NEXT',
	expression: parseSyntax('NEXT {var}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('NEXT only in programs');

		const [v] = s.args as NextArgs;
		const clause = sys.topclause;
		if (!clause || clause.type !== 'for') throw new Error('NEXT without FOR');
		if (clause.v !== v.name) throw new Error('Mismatched NEXT');

		return doNext(sys, clause);
	},
	render(s: Statement) {
		const [v] = s.args as NextArgs;
		return `NEXT ${r(v)}`;
	},
};

export const NextImplicit: Keyword = {
	name: 'next-implicit',
	expression: parseSyntax('NEXT'),
	execute(sys: System) {
		if (sys.state !== SystemState.Execute)
			throw new Error('FOR only in programs');

		const clause = sys.topclause;
		if (!clause || clause.type !== 'for') throw new Error('NEXT without FOR');

		return doNext(sys, clause);
	},
	render() {
		return 'NEXT';
	},
};
