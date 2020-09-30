import Fns from '../Fns';
import Keywords from '../Keywords';
import { parseable } from '../parsing';
import System from '../System';
import Keyword from '../types/Keyword';

export const Help: Keyword = {
	name: 'help',
	visible: 'HELP',
	expression: parseable('HELP'),
	execute(sys: System) {
		sys.display.writenl(`BASIC in a Browser v${sys.vars.get('__version$')}`);

		sys.display.writenl(
			`Commands: ${Object.values(Keywords)
				.filter(k => k.visible)
				.map(k => k.visible)
				.join(' ')}`
		);

		sys.display.writenl(`Functions: ${Object.keys(Fns).join(' ')}`);
	},
	render() {
		return 'HELP';
	},
};
