import {
	Abs,
	Atn,
	Cos,
	Exp,
	Int,
	Log,
	Rnd,
	Sin,
	Sqr,
	Tan,
} from './functions/maths';
import { Fn } from './types/Fn';

const Fns: { [name: string]: Fn } = {};

[Abs, Atn, Cos, Exp, Int, Log, Rnd, Sin, Sqr, Tan].forEach(f => {
	Fns[f.name.toUpperCase()] = f;
});

export default Fns;
