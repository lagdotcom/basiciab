import Clause from './types/Clause';
import Token, { BinaryToken } from './types/Token';
import Vars, { Var } from './Vars';
import Fns from './Fns';
import Display from './types/Display';
import Program from './types/Program';
import Line from './types/Line';
import Keywords from './Keywords';
import Statement from './types/Statement';
import Input from './types/Input';
import parse from './parsing';
import { asBool, isStr, isUndef } from './tools';

export enum SystemState {
	Interpret,
	Execute,
}

export default class System {
	booted: boolean;
	buffer: string;
	increment: Var<number>;
	line: number;
	program: Program;
	raf?: number;
	speed: Var<number>;
	stack: Clause[];
	state: SystemState;
	statement: number;
	vars: Vars;
	version: Var<string>;

	constructor(public display: Display, public input: Input) {
		this.vars = new Vars();
		this.increment = this.vars.add('__increment', { value: 10, system: true });
		this.speed = this.vars.add('__speed', { value: 2 });
		this.vars.constant('pi', Math.PI);
		this.version = this.vars.constant('__version$', '0.1.4');
		this.vars.add('inkey$', {
			value: '',
			system: true,
			get: () => {
				const e = this.input.events.shift();
				return e ? e.key : '';
			},
		});

		display.attach(this);
		this.buffer = '';
		this.line = 0;
		this.program = { name: 'unnamed.bas', lines: [] };
		this.stack = [];
		this.state = SystemState.Interpret;
		this.statement = 0;

		this.booted = false;
		this.tick = this.tick.bind(this);
	}

	get currentLine() {
		const line = this.getLine(this.line);
		if (!line) throw new Error(`Unknown label: ${this.line}`);
		return line;
	}

	get currentStatement() {
		return this.currentLine.statements[this.statement];
	}

	get topclause() {
		if (this.stack.length) return this.stack[this.stack.length - 1];
	}

	getLine(label: number) {
		return this.program.lines.find(l => l.label === label);
	}

	start() {
		//console.log('System: started');
		this.raf = requestAnimationFrame(this.tick);
	}

	tick(t: number) {
		if (!this.booted) {
			this.display.writenl(`BASIC in a Browser v${this.version.value} ready.`);
			this.booted = true;
		}

		if (this.state === SystemState.Interpret) {
			this.input.events.splice(0).forEach(e => {
				switch (e.type) {
					case 'key':
						this.buffer += e.key;
						this.display.write(e.key);
						break;

					case 'back':
						this.buffer = this.buffer.substr(0, this.buffer.length - 1);
						this.display.bs();
						break;

					case 'meta':
						switch (e.key) {
							case 'Enter':
								const inp = this.buffer.trim();
								this.buffer = '';
								this.display.nl();

								if (inp) {
									try {
										const p = parse(inp);
										console.log(p);
										if (p.label !== null) {
											if (p.statements.length) {
												this.add(p);
												this.buffer = `${p.label + this.increment.value} `;
												this.display.write(this.buffer);
											}
										} else {
											this.runStatement(p);
										}
									} catch (err) {
										this.display.writenl((err as Error).message);
									}
								}
								break;
						}
						break;
				}
			});
		} else {
			for (var i = 0; i < this.speed.value; i++) {
				// allow breaking out of infinite loops
				if (this.input.events.find(e => e.type === 'break')) {
					this.display.writenl(`BREAK at ${this.line},${this.statement}`);
					this.input.events.splice(0, this.input.events.length);
					this.state = SystemState.Interpret;
					break;
				}

				this.runCurrentStatement();
				if (this.state !== SystemState.Execute) break;
			}
		}

		this.display.update();

		this.raf = requestAnimationFrame(this.tick);
	}

	evaluate(t: Token): number | string {
		switch (t.type) {
			case 'number':
				return t.value;

			case 'string':
				return t.value;

			case 'variable':
				if (this.vars.has(t.name)) return this.vars.get(t.name);
				throw new Error(`Undeclared variable: ${t.name}`);

			case 'binary':
				return this.op(t);

			case 'fn':
				const fn = Fns[t.name.toUpperCase()];
				if (!fn) throw new Error(`Undeclared function: ${t.name}`);
				return fn.evaluate(this, t.args);
		}

		throw new Error(`Unknown token type: ${t}`);
	}

	op(t: BinaryToken): string | number {
		const l = this.evaluate(t.args[0]);
		const r = this.evaluate(t.args[1]);

		switch (t.op) {
			case '+':
				if (isStr(l)) {
					if (isStr(r)) return l + r;
					return l + r.toString();
				}
				if (isStr(r)) return l.toString() + r;
				return l + r;

			case '-':
				if (isStr(l) || isStr(r)) throw new Error(`Cannot subtract strings`);
				return l - r;

			case '*':
				if (isStr(l) || isStr(r)) throw new Error(`Cannot multiply strings`);
				return l * r;

			case '/':
				if (isStr(l) || isStr(r)) throw new Error(`Cannot divide strings`);
				return l / r;

			case '=':
				return asBool(l == r);

			case '!=':
			case '<>':
				return asBool(l != r);

			case '>':
				if (isStr(l) || isStr(r)) throw new Error('Cannot compare strings');
				return asBool(l > r);

			case '>=':
				if (isStr(l) || isStr(r)) throw new Error('Cannot compare strings');
				return asBool(l >= r);

			case '<':
				if (isStr(l) || isStr(r)) throw new Error('Cannot compare strings');
				return asBool(l < r);

			case '<=':
				if (isStr(l) || isStr(r)) throw new Error('Cannot compare strings');
				return asBool(l <= r);
		}
	}

	add(...lines: Line[]) {
		var needSort = false;

		lines.forEach(nl => {
			const i = this.program.lines.findIndex(l => l.label == nl.label);
			if (i === -1) {
				if (nl.statements.length) {
					this.program.lines.push(nl);
					needSort = true;
				}
			} else {
				if (nl.statements.length) {
					this.program.lines[i] = nl;
				} else {
					this.program.lines.splice(i, 1);
				}
			}
		});

		if (needSort) this.program.lines.sort((a, b) => a.label - b.label);
	}

	run(start?: number) {
		if (!this.program.lines.length) throw new Error('No lines in program');
		if (isUndef(start)) start = this.program.lines[0].label;

		this.state = SystemState.Execute;
		this.line = start;
		this.statement = 0;
	}

	runToEnd(start?: number) {
		if (!this.program.lines.length) throw new Error('No lines in program');
		if (isUndef(start)) start = this.program.lines[0].label;

		this.state = SystemState.Execute;
		this.line = start;
		this.statement = 0;
		while (this.state == SystemState.Execute) this.runCurrentStatement();

		// TODO: message?
	}

	runCurrentStatement() {
		this.runStatement(this.currentStatement);

		this.statement++;
		if (this.statement >= this.currentLine.statements.length) {
			const i = this.program.lines.indexOf(this.currentLine);
			if (i == this.program.lines.length - 1) {
				// TODO: message?
				this.state = SystemState.Interpret;
				return;
			} else {
				this.line = this.program.lines[i + 1].label;
				this.statement = 0;
			}
		}
	}

	runStatement(st: Statement) {
		Keywords[st.keyword].execute(this, st);
	}

	scan(add: string[], sub: string[], score: number = 0) {
		var { line, statement } = this;

		while (true) {
			const cline = this.getLine(line);
			if (!cline) return;

			const cstat = cline.statements[statement];
			if (add.includes(cstat.keyword)) score++;
			else if (sub.includes(cstat.keyword)) score--;

			if (score <= 0) return cline.label;

			statement++;
			if (statement >= cline.statements.length) {
				const i = this.program.lines.indexOf(cline);
				if (i == this.program.lines.length - 1) return;

				line = this.program.lines[i + 1].label;
				statement = 0;
			}
		}
	}
}
