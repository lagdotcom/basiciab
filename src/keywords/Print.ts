import { parseable } from '../parsing';
import r from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';

export const Print: Keyword = {
	name: 'print',
	visible: 'PRINT',
	// TODO: 0-many arguments
	expression: parseable('PRINT {expr}'),
	execute(sys: System, s: Statement) {
		s.args.forEach(arg => {
			const val = sys.evaluate(arg);
			sys.display.write(typeof val === 'string' ? val : val.toString());
		});
		sys.display.nl();
	},
	render(s: Statement) {
		return `PRINT ${s.args.map(r).join('; ')}`;
	},
};
