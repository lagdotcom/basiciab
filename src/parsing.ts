import Keywords from './Keywords';
import Keyword from './types/Keyword';
import Line from './types/Line';
import Statement from './types/Statement';
import Token, { BinaryOp } from './types/Token';

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
type ParsingPattern = LiteralPattern | VariablePattern | ExpressionPattern;
export type ParsingExpression = ParsingPattern[];

export function parseable(s: string): ParsingExpression {
	return s.split(' ').map(value => {
		if (value == '{var}') return { type: 'var' };
		if (value == '{expr}') return { type: 'expr' };
		return { type: 'literal', value };
	});
}

const variableRegex = /^[a-zA-Z_][a-zA-Z0-9_]*\$?$/;
export function isValidVariableName(s: string) {
	return variableRegex.test(s);
}

const numberRegex = /^\d+(\.\d+)?$/;
function isDigit(s: string) {
	return '1234567890'.indexOf(s) !== -1;
}

class Parser {
	constructor(
		public value: string,
		public pos: number = 0,
		public saved: number = 0
	) {}

	get atEnd() {
		return this.pos === this.value.length;
	}

	get remainder() {
		return this.value.substr(this.pos);
	}

	save() {
		this.saved = this.pos;
	}

	restore() {
		this.pos = this.saved;
	}

	eatSpaces() {
		while (' \t\n\r'.indexOf(this.value[this.pos]) !== -1) this.pos++;
	}

	nextWord() {
		this.eatSpaces();

		var allowed = null;
		var curr = '';
		while (true) {
			const ch = this.value[this.pos];
			this.pos++;

			if (' \t\n\r'.indexOf(ch) !== -1) {
				//console.log('word[s]', curr);
				return curr;
			}

			if (allowed) {
				if (!allowed.test(curr + ch)) {
					//console.log('word[p]', curr);
					this.pos--;
					return curr;
				}
				curr += ch;
			} else {
				curr = ch;
				if (isDigit(ch)) allowed = numberRegex;
				else if (isValidVariableName(ch)) allowed = variableRegex;
				else {
					//console.log('word???', curr);
					return curr;
				}
			}

			if (this.atEnd) {
				//console.log('word[e]', curr);
				return curr;
			}
		}
	}

	tryNumber() {
		const old = this.pos;
		const word = this.nextWord();

		if (word) {
			const n = parseInt(word, 10);
			if (!isNaN(n)) {
				//console.log('number', n);
				return n;
			}
		}

		this.pos = old;
	}

	trySeparator() {
		this.eatSpaces();

		if (this.value[this.pos] === ':') {
			this.pos++;

			//console.log('separator', ':');
			return ':';
		}
	}

	tryLiteral(match: string) {
		const old = this.pos;
		const word = this.nextWord();

		if (word.toLowerCase() === match.toLowerCase()) {
			//console.log('literal', word);
			return word;
		}

		this.pos = old;
	}

	tryVariable() {
		//console.log('tryVariable', this.remainder);

		const old = this.pos;
		const word = this.nextWord();
		if (isValidVariableName(word)) {
			//console.log('variable', word);
			return word;
		}

		this.pos = old;
	}

	tryExpression(halt?: string): Token | undefined {
		const stop = halt ? halt.toLowerCase() : halt;
		//console.log('tryExpression', this.remainder, stop);

		// TODO: this does not pay attention to operator precedence

		const old = this.pos;
		var binary: BinaryOp | undefined;
		var fn: string | undefined;
		const tokens: Token[] = [];

		function checkBinary() {
			if (binary) {
				const right = tokens.pop();
				const left = tokens.pop();

				//console.log('bin:', left, binary, right);
				if (left && right) {
					tokens.push({ type: 'binary', op: binary, args: [left, right] });
					binary = undefined;
					return true;
				} else {
					tokens.splice(0, tokens.length);
					return false;
				}
			}

			return true;
		}

		while (!this.atEnd) {
			const num = this.tryNumber();
			if (typeof num === 'number') {
				tokens.push({ type: 'number', value: num });
				if (!checkBinary()) break;
				continue;
			}

			const pos = this.pos;
			const name = this.nextWord();
			if (name === ':') {
				this.pos = pos;
				break;
			}

			if (stop === name.toLowerCase()) {
				this.pos = pos;
				break;
			}

			switch (name) {
				case '+':
				case '-':
				case '*':
				case '/':
					binary = name;
					continue;

				case '(':
					const top = tokens.pop();
					if (top && top.type === 'variable') {
						fn = top.name;
						continue;
					}
					break;

				case ')':
					if (fn) {
						const call: Token = { type: 'fn', name: fn, args: tokens.slice(0) };
						//console.log('fn:', call);
						tokens.splice(0, tokens.length, call);
						fn = undefined;
						continue;
					}
					break;
			}

			if (isValidVariableName(name)) {
				tokens.push({ type: 'variable', name });
				if (!checkBinary()) break;
				continue;
			}

			// TODO
			break;
		}

		if (tokens.length === 1) {
			//console.log('expr:', tokens[0]);
			return tokens[0];
		}

		this.pos = old;
	}
}

function tryKeyword(p: Parser, k: Keyword): Statement | undefined {
	//console.log('tryKeyword', p.remainder, k.name);

	const args: Token[] = [];
	for (var i = 0; i < k.expression.length; i++) {
		if (p.atEnd) return;

		const pat = k.expression[i];
		switch (pat.type) {
			case 'expr':
				const npat = k.expression[i + 1];
				var stop = undefined;
				if (npat && npat.type === 'literal') stop = npat.value;

				const expr = p.tryExpression(stop);
				if (!expr) return;
				args.push(expr);
				continue;

			case 'literal':
				const literal = p.tryLiteral(pat.value);
				if (!literal) return;
				continue;

			case 'var':
				const name = p.tryVariable();
				if (!name) return;
				args.push({ type: 'variable', name });
				continue;
		}

		//throw new Error(`Invalid pattern type: ${pat.type}`);
	}

	return { keyword: k.name, args };
}

function tryParse(p: Parser) {
	var letImplicit;
	var letImplicitPos;

	p.save();
	for (var keyword in Keywords) {
		p.restore();
		const statement = tryKeyword(p, Keywords[keyword]);

		if (statement) {
			if (keyword === 'let-implicit') {
				letImplicit = statement;
				letImplicitPos = p.pos;
			} else return statement;
		}
	}

	if (letImplicitPos) {
		p.pos = letImplicitPos;
		return letImplicit;
	}
}

export default function parse(s: string) {
	const p = new Parser(s);
	const label = p.tryNumber();
	const statements: Statement[] = [];

	while (!p.atEnd) {
		if (statements.length) {
			const sep = p.trySeparator();
			if (!sep) throw new Error(`Could not parse: ${p.remainder}`);
		}

		const statement = tryParse(p);
		if (!statement) throw new Error(`Could not parse: ${p.remainder}`);

		statements.push(statement);
	}

	if (label) {
		return { label, statements } as Line;
	}

	return statements[0];
}