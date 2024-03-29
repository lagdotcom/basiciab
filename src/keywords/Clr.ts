import Keyword from '../types/Keyword';
import System from '../System';
import parseSyntax from '../parseSyntax';

export const Clr: Keyword = {
	name: 'clr',
	visible: 'CLR',
	expression: parseSyntax('CLR'),
	execute(sys: System) {
		sys.vars.clear();
	},
	render() {
		return 'CLR';
	},
};
