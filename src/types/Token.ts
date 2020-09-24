export interface NumberToken {
	type: 'number';
	value: number;
}

export interface StringToken {
	type: 'string';
	value: string;
}

export interface VariableToken {
	type: 'variable';
	name: string;
}

export type BinaryOp = '+' | '-' | '*' | '/';

export interface BinaryToken {
	type: 'binary';
	op: BinaryOp;
	args: [left: Token, right: Token];
}

export interface FnToken {
	type: 'fn';
	name: string;
	args: Token[];
}

type Token = NumberToken | StringToken | VariableToken | BinaryToken | FnToken;
export default Token;
