import System from '../System';
import { Fn } from '../types/Fn';
import Token from '../types/Token';

export const Asc: Fn = {
	name: 'asc',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('ASC takes 1 argument');
		const value = sys.evaluate(args[0]);
		if (typeof value === 'number') throw new Error(`ASC only uses strings`);

		return value.charCodeAt(0);
	},
};

export const Chr: Fn = {
	name: 'chr$',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('CHR$ takes 1 argument');
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`CHR$ only uses numbers`);

		return String.fromCharCode(value);
	},
};

export const Len: Fn = {
	name: 'len',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('LEN takes 1 argument');
		const value = sys.evaluate(args[0]);
		if (typeof value === 'number') throw new Error(`LEN only uses strings`);

		return value.length;
	},
};

export const Val: Fn = {
	name: 'val',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('VAL takes 1 argument');
		const value = sys.evaluate(args[0]);
		if (typeof value === 'number') throw new Error(`VAL only uses strings`);

		const num = parseInt(value, 10);
		return isNaN(num) ? 0 : num;
	},
};
