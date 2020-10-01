import { parseable } from '../parsing';
import { renderLine } from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';

export const List: Keyword = {
	name: 'list',
	visible: 'LIST',
	expression: parseable('LIST'),
	execute(sys: System) {
		sys.program.lines.forEach(l => {
			sys.display.writenl(renderLine(l));
		});

		if (sys.program.lines.length === 0) sys.display.writenl('Program is empty');
	},
	render() {
		return 'LIST';
	},
};
