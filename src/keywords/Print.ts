import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import System from '../System';
import { isStr } from '../tools';
import parseSyntax from '../parseSyntax';
import r from '../rendering';

export const Print: Keyword = {
	name: 'print',
	visible: 'PRINT',
	// TODO: 0-many arguments
	expression: parseSyntax('PRINT {expr}'),
	execute(sys: System, s: Statement) {
		s.args.forEach(arg => {
			const val = sys.evaluate(arg);
			sys.display.write(isStr(val) ? val : val.toString());
		});
		sys.display.nl();
	},
	render(s: Statement) {
		return `PRINT ${s.args.map(r).join('; ')}`;
	},
};

export const PrintNoNL: Keyword = {
	name: 'print-no-nl',
	visible: 'PRINT',
	// TODO: 0-many arguments
	expression: parseSyntax('PRINT {expr} ;'),
	execute(sys: System, s: Statement) {
		s.args.forEach(arg => {
			const val = sys.evaluate(arg);
			sys.display.write(isStr(val) ? val : val.toString());
		});
	},
	render(s: Statement) {
		return `PRINT ${s.args.map(r).join('; ')};`;
	},
};
