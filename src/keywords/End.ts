import System, { SystemState } from '../System';

import Keyword from '../types/Keyword';
import parseSyntax from '../parseSyntax';

export const End: Keyword = {
	name: 'end',
	visible: 'END',
	expression: parseSyntax('END'),
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
