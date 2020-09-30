import System from '../System';
import { isNum, isStr } from '../tools';
import { Fn } from '../types/Fn';
import Token from '../types/Token';

export const Asc: Fn = {
	name: 'asc',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('ASC takes 1 argument');
		const str = sys.evaluate(args[0]);
		if (!isStr(str)) throw new Error(`ASC only uses strings`);

		return str.charCodeAt(0);
	},
};

export const Chr: Fn = {
	name: 'chr$',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('CHR$ takes 1 argument');
		const num = sys.evaluate(args[0]);
		if (!isNum(num)) throw new Error(`CHR$ only uses numbers`);

		return String.fromCharCode(num);
	},
};

export const Left: Fn = {
	name: 'left$',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 2) throw new Error('LEFT$ takes 2 arguments');
		const str = sys.evaluate(args[0]);
		const len = sys.evaluate(args[1]);
		if (!isStr(str) || !isNum(len))
			throw new Error(`syntax: LEFT$(string, number)`);

		return str.substr(0, len);
	},
};

export const Len: Fn = {
	name: 'len',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('LEN takes 1 argument');
		const str = sys.evaluate(args[0]);
		if (!isStr(str)) throw new Error(`LEN only uses strings`);

		return str.length;
	},
};

export const Mid: Fn = {
	name: 'mid$',
	evaluate(sys: System, args: Token[]) {
		if (args.length < 2 || args.length > 3)
			throw new Error('MID$ takes 2-3 arguments');
		const str = sys.evaluate(args[0]);
		const start = sys.evaluate(args[1]);
		if (!isStr(str) || !isNum(start))
			throw new Error(`syntax: MID$(string, number[, number])`);

		const len = args.length === 3 ? sys.evaluate(args[2]) : str.length;
		if (!isNum(len)) throw new Error(`syntax: MID$(string, number[, number])`);

		return str.substr(start, len);
	},
};

export const Right: Fn = {
	name: 'right$',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 2) throw new Error('RIGHT$ takes 2 arguments');
		const str = sys.evaluate(args[0]);
		const len = sys.evaluate(args[1]);
		if (!isStr(str) || !isNum(len))
			throw new Error(`syntax: RIGHT$(string, number)`);

		return str.substr(str.length - len);
	},
};

export const Str: Fn = {
	name: 'str$',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('STR$ takes 1 argument');
		const num = sys.evaluate(args[0]);
		if (!isNum(num)) throw new Error(`STR$ only uses numbers`);

		return num.toString();
	},
};

export const Val: Fn = {
	name: 'val',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error('VAL takes 1 argument');
		const str = sys.evaluate(args[0]);
		if (!isStr(str)) throw new Error(`VAL only uses strings`);

		const num = parseInt(str, 10);
		return isNaN(num) ? 0 : num;
	},
};
