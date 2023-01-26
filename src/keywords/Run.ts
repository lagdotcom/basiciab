import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import System from '../System';
import Token from '../types/Token';
import { isNum } from '../tools';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

export const Run: Keyword = {
	name: 'run',
	visible: 'RUN',
	expression: parseSyntax('RUN'),
	execute(sys: System) {
		sys.run();
	},
	render() {
		return 'RUN';
	},
};

type RunLineArgs = [expr: Token];
export const RunLine: Keyword = {
	name: 'run-line',
	expression: parseSyntax('RUN {expr}'),
	execute(sys: System, s: Statement) {
		const [expr] = s.args as RunLineArgs;
		const label = sys.evaluate(expr);
		if (!isNum(label)) throw new Error('RUN only uses numbers');

		sys.run(label);
	},
	render(s: Statement) {
		return `RUN ${r(s.args[0])}`;
	},
};
