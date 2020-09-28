import { parseable } from '../parsing';
import System from '../System';
import Keyword from '../types/Keyword';

export const Clr: Keyword = {
	name: 'clr',
	expression: parseable('CLR'),
	execute(sys: System) {
		sys.vars.clear();
	},
	render() {
		return 'CLR';
	},
};
