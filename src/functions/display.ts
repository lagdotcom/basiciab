import { Fn } from '../types/Fn';
import System from '../System';
import Token from '../types/Token';

export const Pos: Fn = {
	name: 'pos',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 0) throw new Error('POS takes no arguments');
		return sys.display.pos;
	},
};
