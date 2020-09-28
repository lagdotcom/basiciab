import System from '../System';
import { Fn } from '../types/Fn';
import Token from '../types/Token';

export const Pos: Fn = {
	name: 'pos',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 0) throw new Error('POS takes no arguments');
		return sys.display.pos;
	},
};
