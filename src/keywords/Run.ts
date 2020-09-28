import { parseable } from '../parsing';
import r from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token from '../types/Token';

export const Run: Keyword = {
	name: 'run',
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
		const line = sys.evaluate(expr);
		if (typeof line === 'string') throw new Error('RUN only uses numbers');

		sys.run(line);
	},
	render(s: Statement) {
		return `RUN ${r(s.args[0])}`;
	},
};
