import Keyword from './types/Keyword';
import { For, ForStep } from './keywords/For';
import { LetImplicit, Let } from './keywords/Let';
import { NextImplicit, Next } from './keywords/Next';

const Keywords: { [name: string]: Keyword } = {};

[For, ForStep, Let, LetImplicit, Next, NextImplicit].forEach(k => {
	Keywords[k.name] = k;
});

export default Keywords;
