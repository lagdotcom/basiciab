import Token, { BinaryOp } from './types/Token';
import { isNum, isStr } from './tools';

import Keyword from './types/Keyword';
import Keywords from './Keywords';
import Line from './types/Line';
import Statement from './types/Statement';

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
		return this.pos >= this.value.length;
	}

	get remainder() {
		return this.value.substr(this.pos);
	}

	get peek() {
		return this.value.substr(this.pos, 1);
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
				this.log('found number:', n);
				return n;
			}
		}

		this.pos = old;
	}

	tryString() {
		this.eatSpaces();

		if (this.value[this.pos] === '"') {
			const old = this.pos;
			var str = '';
			this.pos++;

			while (this.value[this.pos] !== '"') {
				str += this.value[this.pos];
				this.pos++;

				if (this.atEnd) {
					this.pos = old;
					return;
				}
			}

			this.pos++;
			return str;
		}
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
			this.log('found literal:', word);
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
		const fnStack: string[] = [];
		const tokens: Token[] = [];

		const checkBinary = () => {
			if (binary) {
				const right = tokens.pop();
				const left = tokens.pop();

				this.log('bin:', left, binary, right);
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
		};

		while (!this.atEnd) {
			const num = this.tryNumber();
			if (isNum(num)) {
				tokens.push({ type: 'number', value: num });
				this.log('num:', num);
				if (!checkBinary()) break;
				continue;
			}

			const str = this.tryString();
			if (isStr(str)) {
				tokens.push({ type: 'string', value: str });
				this.log('str:', str);
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

			// TODO: this kind of sucks, should probably make a real tokenizer
			switch (name) {
				case '+':
				case '-':
				case '*':
				case '/':
				case '<':
					binary = name;
					continue;

				case '>':
					if (binary === undefined) {
						binary = '>';
						continue;
					}
					if (binary === '<') {
						binary = '<>';
						continue;
					}
					break;

				case '=':
					if (binary === undefined) {
						binary = '=';
						continue;
					}
					if (binary === '<') {
						binary = '<=';
						continue;
					}
					if (binary === '>') {
						binary = '>=';
						continue;
					}
					break;

				case '!':
					if (this.peek === '=') {
						binary = '!=';
						this.pos++;
						continue;
					}
					break;

				case '(':
					const top = tokens.pop();
					if (top && top.type === 'variable') {
						fnStack.push(top.name);
						continue;
					}
					break;

				case ')':
					const fn = fnStack.pop();
					if (fn) {
						const call: Token = { type: 'fn', name: fn, args: tokens.slice(0) };
						this.log('fn:', call);
						tokens.splice(0, tokens.length, call);
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
			this.log('expr:', tokens[0]);
			return tokens[0];
		}

		this.log('failed, tokens=', tokens);
		this.pos = old;
	}

	log(...args: any[]) {
		// console.log(`parse@${this.pos}`, ...args);
	}
}

function tryKeyword(p: Parser, k: Keyword): Statement | undefined {
	//console.log('tryKeyword', p.remainder, k.name);
	p.log('trying keyword:', k.name);

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

			case 'number':
				const value = p.tryNumber();
				if (!isNum(value)) return;
				args.push({ type: 'number', value });
				continue;
		}

		throw new Error(`Invalid pattern type: ${pat}`);
	}

	return { label: null, keyword: k.name, args };
}

function tryParse(p: Parser) {
	p.save();
	for (var keyword in Keywords) {
		const statement = tryKeyword(p, Keywords[keyword]);

		if (statement) return statement;
		p.restore();
	}
}

export default function parse(s: string) {
	const p = new Parser(s);
	const label = p.tryNumber();
	const statements: Statement[] = [];
	var lastpos = p.pos;

	while (!p.atEnd) {
		if (statements.length) {
			const sep = p.trySeparator();
			if (!sep) throw new Error(`Could not parse: ${p.remainder}`);
		}

		const statement = tryParse(p);
		if (!statement) throw new Error(`Could not parse: ${p.remainder}`);

		statements.push(statement);

		if (p.pos === lastpos) {
			throw new Error('Parsing halted');
		}
		lastpos = p.pos;
	}

	if (label) {
		return { label, statements } as Line;
	}

	return statements[0];
}
