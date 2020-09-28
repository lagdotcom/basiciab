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
		sys.display.write(`BASIC in a Browser v${sys.vars.get('__version$')}`);
		sys.display.nl();

		sys.display.write(
			`Commands: ${Object.values(Keywords)
				.filter(k => k.visible)
				.map(k => k.visible)
				.join(' ')}`
		);
		sys.display.nl();

		sys.display.write(`Functions: ${Object.keys(Fns).join(' ')}`);
		sys.display.nl();
	},
	render() {
		return 'HELP';
	},
};
