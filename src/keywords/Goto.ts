import System, { SystemState } from '../System';

import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token from '../types/Token';
import { isNum } from '../tools';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

type GotoArgs = [expr: Token];
export const Goto: Keyword = {
	name: 'goto',
	visible: 'GOTO',
	expression: parseSyntax('GOTO {expr}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('GOTO only in programs');

		const [expr] = s.args as GotoArgs;
		const label = sys.evaluate(expr);
		if (!isNum(label)) throw new Error('GOTO only uses numbers');

		sys.line = label;
		sys.statement = -1;
	},
	render(s: Statement) {
		const [expr] = s.args as GotoArgs;
		return `GOTO ${r(expr)}`;
	},
};
