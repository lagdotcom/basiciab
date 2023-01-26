import Keyword from '../types/Keyword';
import System from '../System';
import parseSyntax from '../parseSyntax';

export const Cls: Keyword = {
	name: 'cls',
	visible: 'CLS',
	expression: parseSyntax('CLS'),
	execute(sys: System) {
		sys.display.cls();
	},
	render() {
		return 'CLS';
	},
};
