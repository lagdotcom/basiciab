import Keyword from './types/Keyword';
import { End } from './keywords/End';
import { For, ForStep } from './keywords/For';
import { Goto } from './keywords/Goto';
import { LetImplicit, Let } from './keywords/Let';
import { NextImplicit, Next } from './keywords/Next';

const Keywords: { [name: string]: Keyword } = {};

[End, For, ForStep, Goto, Let, LetImplicit, Next, NextImplicit].forEach(k => {
	Keywords[k.name] = k;
});

export default Keywords;
