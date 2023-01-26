import { Download, Upload } from './keywords/Files';
import { Else, EndIf, If, IfThenElseGoto, IfThenGoto } from './keywords/If';
import { For, ForStep, Next, NextImplicit } from './keywords/For';
import { Let, LetImplicit } from './keywords/Let';
import { Print, PrintNoNL } from './keywords/Print';
import { Run, RunLine } from './keywords/Run';
import { Wend, While } from './keywords/While';

import { Clr } from './keywords/Clr';
import { Cls } from './keywords/Cls';
import { End } from './keywords/End';
import { Goto } from './keywords/Goto';
import { Help } from './keywords/Help';
import { Line } from './keywords/Line';
import { List } from './keywords/List';

const Keywords = Object.fromEntries(
	[
		Clr,
		Cls,
		Download,
		Else,
		EndIf,
		End,
		ForStep,
		For,
		Goto,
		Help,
		IfThenElseGoto,
		IfThenGoto,
		If,
		Let,
		Line,
		List,
		Next,
		NextImplicit,
		PrintNoNL,
		Print,
		RunLine,
		Run,
		Upload,
		While,
		Wend,
		LetImplicit,
	].map(kw => [kw.name, kw])
);
if (typeof window !== 'undefined') (window as any).Keywords = Keywords;

export default Keywords;
