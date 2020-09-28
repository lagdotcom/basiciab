import Keyword from './types/Keyword';
import { End } from './keywords/End';
import { For, ForStep } from './keywords/For';
import { Goto } from './keywords/Goto';
import { LetImplicit, Let } from './keywords/Let';
import { NextImplicit, Next } from './keywords/Next';
import { Print } from './keywords/Print';

const Keywords: { [name: string]: Keyword } = {};

[End, For, ForStep, Goto, Let, Next, NextImplicit, Print, LetImplicit].forEach(
	k => {
		Keywords[k.name] = k;
	}
);

export default Keywords;
