import Keyword from './types/Keyword';
import { Clr } from './keywords/Clr';
import { End } from './keywords/End';
import { For, ForStep } from './keywords/For';
import { Goto } from './keywords/Goto';
import { LetImplicit, Let } from './keywords/Let';
import { Line } from './keywords/Line';
import { NextImplicit, Next } from './keywords/Next';
import { Print } from './keywords/Print';
import { Run, RunLine } from './keywords/Run';
import { Help } from './keywords/Help';

const Keywords: { [name: string]: Keyword } = {};

[
	Clr,
	End,
	For,
	ForStep,
	Goto,
	Help,
	Let,
	Line,
	Next,
	NextImplicit,
	Print,
	RunLine,
	Run,
	LetImplicit,
].forEach(k => {
	Keywords[k.name] = k;
});

export default Keywords;
