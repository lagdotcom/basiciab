import { parseable } from '../parsing';
import r from '../rendering';
import System from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token from '../types/Token';

type LineArgs = [x1: Token, y1: Token, x2: Token, y2: Token];

export const Line: Keyword = {
	name: 'line',
	visible: 'LINE',
	expression: parseable('LINE {expr} , {expr} TO {expr} , {expr}'),
	execute(sys: System, s: Statement) {
		const [tx1, ty1, tx2, ty2] = s.args as LineArgs;

		const x1 = sys.evaluate(tx1);
		const y1 = sys.evaluate(ty1);
		const x2 = sys.evaluate(tx2);
		const y2 = sys.evaluate(ty2);
		if (
			typeof x1 !== 'number' ||
			typeof y1 !== 'number' ||
			typeof x2 !== 'number' ||
			typeof y2 !== 'number'
		)
			throw new Error('LINE only works with numbers');

		sys.display.line(x1, y1, x2, y2);
	},
	render(s: Statement) {
		const [x1, y1, x2, y2] = s.args as LineArgs;
		return `LINE ${r(x1)}, ${r(y1)} TO ${r(x2)}, ${r(y2)}`;
	},
};
