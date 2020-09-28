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
