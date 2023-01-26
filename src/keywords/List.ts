import Keyword from '../types/Keyword';
import System from '../System';
import parseSyntax from '../parseSyntax';
import { renderLine } from '../rendering';

export const List: Keyword = {
	name: 'list',
	visible: 'LIST',
	expression: parseSyntax('LIST'),
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
