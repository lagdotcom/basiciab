import Keyword from './types/Keyword';
import { End } from './keywords/End';
import { For, ForStep } from './keywords/For';
import { Goto } from './keywords/Goto';
import { LetImplicit, Let } from './keywords/Let';
import { NextImplicit, Next } from './keywords/Next';
import { Print } from './keywords/Print';
import { Clr } from './keywords/Clr';
import { Run, RunLine } from './keywords/Run';

const Keywords: { [name: string]: Keyword } = {};

[
	Clr,
	End,
	For,
	ForStep,
	Goto,
	Let,
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
