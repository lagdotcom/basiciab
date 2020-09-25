import { parseable } from '../parsing';
import System, { SystemState } from '../System';
import Keyword from '../types/Keyword';

export const End: Keyword = {
	name: 'end',
	expression: parseable('END'),
	execute(sys: System) {
		if (sys.state !== SystemState.Execute)
			throw new Error('END only in programs');

		sys.state = SystemState.Interpret;
		sys.display.write(`END at ${sys.line}`);
	},
	render() {
		return 'END';
	},
};
