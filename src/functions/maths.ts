import System from '../System';
import { Fn } from '../types/Fn';
import Token from '../types/Token';

export const Abs: Fn = {
	name: 'abs',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`ABS takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`ABS only uses numbers`);

		return Math.abs(value);
	},
};

export const Atn: Fn = {
	name: 'atn',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`ATN takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`ATN only uses numbers`);

		return Math.atan(value);
	},
};

export const Cos: Fn = {
	name: 'cos',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`COS takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`COS only uses numbers`);

		return Math.cos(value);
	},
};

export const Exp: Fn = {
	name: 'exp',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`EXP takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`EXP only uses numbers`);

		return Math.exp(value);
	},
};

export const Int: Fn = {
	name: 'int',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`INT takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`INT only uses numbers`);

		return Math.floor(value);
	},
};

export const Log: Fn = {
	name: 'log',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`LOG takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`LOG only uses numbers`);

		return Math.log(value);
	},
};

export const Rnd: Fn = {
	name: 'rnd',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 0) throw new Error(`RND takes no arguments`);

		return Math.random();
	},
};

export const Sgn: Fn = {
	name: 'sgn',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`SGN takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`SGN only uses numbers`);

		return value == 0 ? 0 : value < 0 ? -1 : 1;
	},
};

export const Sin: Fn = {
	name: 'sin',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`SIN takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`SIN only uses numbers`);

		return Math.sin(value);
	},
};

export const Sqr: Fn = {
	name: 'sqr',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`SQR takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`SQR only uses numbers`);

		return Math.sqrt(value);
	},
};

export const Tan: Fn = {
	name: 'tan',
	evaluate(sys: System, args: Token[]) {
		if (args.length !== 1) throw new Error(`TAN takes 1 argument`);
		const value = sys.evaluate(args[0]);
		if (typeof value === 'string') throw new Error(`TAN only uses numbers`);

		return Math.tan(value);
	},
};
