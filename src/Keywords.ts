import Keyword from './types/Keyword';
import { Clr } from './keywords/Clr';
import { End } from './keywords/End';
import { Download, Upload } from './keywords/Files';
import { For, ForStep, NextImplicit, Next } from './keywords/For';
import { Goto } from './keywords/Goto';
import { Help } from './keywords/Help';
import { Else, EndIf, If, IfThenElseGoto, IfThenGoto } from './keywords/If';
import { LetImplicit, Let } from './keywords/Let';
import { Line } from './keywords/Line';
import { List } from './keywords/List';
import { Print } from './keywords/Print';
import { Run, RunLine } from './keywords/Run';
import { Wend, While } from './keywords/While';

const Keywords: { [name: string]: Keyword } = {};

[
	Clr,
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
	Print,
	RunLine,
	Run,
	Upload,
	While,
	Wend,
	LetImplicit,
].forEach(k => {
	Keywords[k.name] = k;
});
(window as any).Keywords = Keywords;

export default Keywords;
