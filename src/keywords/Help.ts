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
		sys.display.writenl(`BASIC in a Browser v${sys.version.value}`);
		sys.display.writenl('Any questions? Ask lagdotcom@gmail.com');

		sys.display.writenl(
			`Commands: ${Object.values(Keywords)
				.filter(k => k.visible)
				.map(k => k.visible)
				.sort()
				.join(' ')}`
		);

		sys.display.writenl(`Functions: ${Object.keys(Fns).join(' ')}`);

		sys.display.writenl(
			`System: ${Object.entries(sys.vars.vars)
				.sort(([ak, _av], [bk, _bv]) => ak.localeCompare(bk))
				.filter(([_, v]) => v.system)
				.map(([k, _]) => k.toUpperCase())
				.join(' ')}`
		);
	},
	render() {
		return 'HELP';
	},
};
