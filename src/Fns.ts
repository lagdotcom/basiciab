import { Asc, Chr, Len, Val } from './functions/conversion';
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
	Len,
	Log,
	Pos,
	Rnd,
	Sgn,
	Sin,
	Sqr,
	Tan,
	Val,
].forEach(f => {
	Fns[f.name.toUpperCase()] = f;
});

export default Fns;
