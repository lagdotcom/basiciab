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

export enum SystemState {
	Interpret,
	Execute,
}

export default class System {
	buffer: string;
	increment: Var<number>;
	line: number;
	program: Program;
	raf?: number;
	stack: Clause[];
	state: SystemState;
	statement: number;
	vars: Vars;

	constructor(public display: Display, public input: Input) {
		this.vars = new Vars();
		this.increment = this.vars.add('__increment', { value: 10 });
		this.vars.add('pi', {
			value: 0,
			get() {
				return Math.PI;
			},
		});
		this.vars.add('__version$', {
			value: '',
			get() {
				return '0.1.0';
			},
		});

		display.attach(this);
		this.buffer = '';
		this.line = 0;
		this.program = { name: 'unnamed', lines: [] };
		this.stack = [];
		this.state = SystemState.Interpret;
		this.statement = 0;

		this.tick = this.tick.bind(this);
	}

	get currentLine() {
		const line = this.program.lines.find(l => l.label === this.line);
		if (!line) throw new Error(`Unknown label: ${this.line}`);
		return line;
	}

	get currentStatement() {
		return this.currentLine.statements[this.statement];
	}

	get topclause() {
		if (this.stack.length) return this.stack[this.stack.length - 1];
	}

	start() {
		//console.log('System: started');
		this.raf = requestAnimationFrame(this.tick);
	}

	tick(t: number) {
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
											this.add(p);
											this.buffer = `${p.label + this.increment.value} `;
											this.display.write(this.buffer);
										} else {
											this.runStatement(p);
										}
									} catch (err) {
										this.display.write((err as Error).message);
										this.display.nl();
									}
								}
								break;
						}
						break;
				}
			});
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

		//throw new Error(`Unknown token type: ${t.type}`);
	}

	op(t: BinaryToken) {
		const l = this.evaluate(t.args[0]);
		const r = this.evaluate(t.args[1]);

		switch (t.op) {
			case '+':
				if (typeof l === 'string') {
					if (typeof r === 'string') return l + r;
					return l + r.toString();
				}
				if (typeof r === 'string') return l.toString() + r;
				return l + r;

			case '-':
				if (typeof l === 'string' || typeof r === 'string')
					throw new Error(`Cannot subtract strings`);
				return l - r;

			case '*':
				if (typeof l === 'string' || typeof r === 'string')
					throw new Error(`Cannot multiply strings`);
				return l * r;

			case '/':
				if (typeof l === 'string' || typeof r === 'string')
					throw new Error(`Cannot divide strings`);
				return l / r;
		}

		throw new Error(`Unsupported binary op: ${t.op}`);
	}

	add(...lines: Line[]) {
		var needSort = false;

		lines.forEach(nl => {
			const i = this.program.lines.findIndex(l => l.label == nl.label);
			if (i === -1) {
				this.program.lines.push(nl);
				needSort = true;
			} else {
				this.program.lines[i] = nl;
			}
		});

		if (needSort) this.program.lines.sort((a, b) => a.label - b.label);
	}

	run(start?: number) {
		// TODO: this doesn't work with raf

		if (!this.program.lines.length) throw new Error('No lines in program');
		if (typeof start === 'undefined') start = this.program.lines[0].label;

		this.state = SystemState.Execute;
		this.line = start;
		this.statement = 0;
		while (this.state == SystemState.Execute) {
			this.runStatement(this.currentStatement);

			this.statement++;
			if (this.statement == this.currentLine.statements.length) {
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

		// TODO: message?
	}

	runStatement(st: Statement) {
		Keywords[st.keyword].execute(this, st);
	}
}
