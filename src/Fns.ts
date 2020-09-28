import { Asc, Chr, Left, Len, Mid, Right, Str, Val } from './functions/string';
import { Pos } from './functions/display';
import {
	Abs,
	Atn,
	Cos,
	Exp,
	Int,
	Log,
	Rnd,
	Sgn,
	Sin,
	Sqr,
	Tan,
} from './functions/maths';
import { Fn } from './types/Fn';

const Fns: { [name: string]: Fn } = {};

[
	Abs,
	Asc,
	Atn,
	Chr,
	Cos,
	Exp,
	Int,
	Left,
	Len,
	Log,
	Mid,
	Pos,
	Right,
	Rnd,
	Sgn,
	Sin,
	Sqr,
	Str,
	Tan,
	Val,
].forEach(f => {
	Fns[f.name.toUpperCase()] = f;
});

export default Fns;
