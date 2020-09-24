import Clause from './types/Clause';
import Display from './Display';
import Token, { BinaryToken } from './types/Token';
import Vars from './Vars';
import Fns from './Fns';

export enum SystemState {
	Interpret,
	Execute,
}

export default class System {
	display: Display;
	line: number;
	raf: number;
	stack: Clause[];
	state: SystemState;
	statement: number;
	vars: Vars;

	constructor(canvas: HTMLCanvasElement) {
		this.vars = new Vars();
		this.vars.add('__version$', {
			value: '',
			get() {
				return '0.1.0';
			},
		});

		this.display = new Display(this, canvas);
		this.line = 0;
		this.stack = [];
		this.state = SystemState.Interpret;
		this.statement = 0;

		this.tick = this.tick.bind(this);

		//console.log('System: started');
		this.raf = requestAnimationFrame(this.tick);
	}

	get topclause() {
		if (this.stack.length) return this.stack[this.stack.length - 1];
	}

	tick(t: number) {
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
				const fn = Fns[t.name];
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
}
