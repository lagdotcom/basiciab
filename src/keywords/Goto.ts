import r from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token from '../types/Token';

type GotoArgs = [expr: Token];
export const Goto: Keyword = {
	name: 'goto',
	execute(sys: System, s: Statement) {
		const [expr] = s.args as GotoArgs;
		const line = sys.evaluate(expr);
		if (typeof line === 'string') throw new Error('GOTO only uses numbers');

		sys.line = line;
		sys.statement = -1;
	},
	render(s: Statement) {
		const [expr] = s.args as GotoArgs;
		return `GOTO ${r(expr)}`;
	},
};
