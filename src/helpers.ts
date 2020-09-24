import Line from './types/Line';
import Statement from './types/Statement';
import Token, {
	BinaryOp,
	BinaryToken,
	FnToken,
	NumberToken,
	StringToken,
	VariableToken,
} from './types/Token';

export const LINE = (label: number, ...statements: Statement[]): Line => ({
	label,
	statements,
});
export const ST = (keyword: string, ...args: Token[]): Statement => ({
	keyword,
	args,
});
export const VAR = (name: string): VariableToken => ({
	type: 'variable',
	name,
});
export const NUM = (value: number): NumberToken => ({ type: 'number', value });
export const STR = (value: string): StringToken => ({ type: 'string', value });
export const FN = (name: string, ...args: Token[]): FnToken => ({
	type: 'fn',
	name,
	args,
});
export const OP = (left: Token, op: BinaryOp, right: Token): BinaryToken => ({
	type: 'binary',
	op,
	args: [left, right],
});
