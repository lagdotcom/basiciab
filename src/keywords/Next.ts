import { parseable } from '../parsing';
import r from '../rendering';
import System, { SystemState } from '../System';
import { ForClause } from '../types/Clause';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import { VariableToken } from '../types/Token';

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
	expression: parseable('NEXT {var}'),
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
	expression: parseable('NEXT'),
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
