import { parseable } from '../parsing';
import { renderLine } from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';

export const List: Keyword = {
	name: 'list',
	visible: 'list',
	expression: parseable('LIST'),
	execute(sys: System) {
		sys.program.lines.forEach(l => {
			sys.display.write(renderLine(l));
			sys.display.nl();
		});
	},
	render() {
		return 'LIST';
	},
};
