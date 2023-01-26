interface LiteralPattern {
	type: 'literal';
	value: string;
}
interface VariablePattern {
	type: 'var';
}
interface ExpressionPattern {
	type: 'expr';
}
interface NumberPattern {
	type: 'number';
}
type ParsingPattern =
	| LiteralPattern
	| VariablePattern
	| ExpressionPattern
	| NumberPattern;
export type ParsingExpression = ParsingPattern[];

export default function parseSyntax(s: string): ParsingExpression {
	return s.split(' ').map(value => {
		if (value == '{var}') return { type: 'var' };
		if (value == '{expr}') return { type: 'expr' };
		if (value == '{number}') return { type: 'number' };
		return { type: 'literal', value };
	});
}
