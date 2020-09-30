import { parseable } from '../parsing';
import r from '../rendering';
import System from '../System';
import { isNum } from '../tools';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token from '../types/Token';

export const Run: Keyword = {
	name: 'run',
	visible: 'RUN',
	expression: parseable('RUN'),
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
	expression: parseable('RUN {expr}'),
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
