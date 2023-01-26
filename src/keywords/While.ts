import System, { SystemState } from '../System';

import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

export const While: Keyword = {
	name: 'while',
	visible: 'WHILE',
	expression: parseSyntax('WHILE {expr}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('WHILE only in programs');

		if (!sys.evaluate(s.args[0])) {
			const label = sys.scan(['while'], ['wend']);
			if (!label) throw new Error('WHILE without WEND');

			sys.line = label;
			sys.statement = 0; // skip WEND
			return;
		}

		sys.stack.push({ type: 'while', line: sys.line, statement: sys.statement });
	},
	render(s: Statement) {
		return `WHILE ${r(s.args[0])}`;
	},
};

export const Wend: Keyword = {
	name: 'wend',
	visible: 'WEND',
	expression: parseSyntax('WEND'),
	execute(sys: System) {
		if (sys.state !== SystemState.Execute)
			throw new Error('WEND only in programs');

		const clause = sys.topclause;
		if (!clause || clause.type !== 'while')
			throw new Error('WEND without WHILE');

		sys.stack.pop();
		sys.line = clause.line;
		sys.statement = clause.statement - 1;
	},
	render() {
		return 'WEND';
	},
};
