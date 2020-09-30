import { parseable } from '../parsing';
import r from '../rendering';
import System, { SystemState } from '../System';
import Keyword from '../types/Keyword';
import Statement from '../types/Statement';
import Token, { NumberToken } from '../types/Token';

export const If: Keyword = {
	name: 'if',
	visible: 'if',
	expression: parseable('IF {expr}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('IF only in programs');

		const expr = s.args[0];
		if (!sys.evaluate(expr)) {
			const label = sys.scan(['if'], ['else', 'endif']);
			if (!label) throw new Error('IF without ELSE/ENDIF');

			sys.line = label;
			sys.statement = 0; // this skips the ELSE/ENDIF line
		}
	},
	render(s: Statement) {
		return `IF ${r(s.args[0])}`;
	},
};

export const Else: Keyword = {
	name: 'else',
	visible: 'else',
	expression: parseable('ELSE'),
	execute(sys: System) {
		if (sys.state !== SystemState.Execute)
			throw new Error('ELSE only in programs');

		const label = sys.scan(['if'], ['endif'], 1);
		if (!label) throw new Error('ELSE without ENDIF');

		sys.line = label;
		sys.statement = 0; // this skips the ENDIF line
	},
	render() {
		return 'ELSE';
	},
};

export const EndIf: Keyword = {
	name: 'endif',
	visible: 'endif',
	expression: parseable('ENDIF'),
	execute(sys: System) {
		if (sys.state !== SystemState.Execute)
			throw new Error('ENDIF only in programs');
	},
	render() {
		return 'ENDIF';
	},
};

type IfThenGotoArgs = [expr: Token, label: NumberToken];
export const IfThenGoto: Keyword = {
	name: 'if-then-goto',
	expression: parseable('IF {expr} THEN {number}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('IF only in programs');

		const [expr, label] = s.args as IfThenGotoArgs;
		if (sys.evaluate(expr)) {
			sys.line = label.value;
			sys.statement = -1;
		}
	},
	render(s: Statement) {
		const [expr, label] = s.args as IfThenGotoArgs;
		return `IF ${r(expr)} THEN ${r(label)}`;
	},
};

type IfThenElseGotoArgs = [
	expr: Token,
	thenLabel: NumberToken,
	elseLabel: NumberToken
];
export const IfThenElseGoto: Keyword = {
	name: 'if-then-else-goto',
	expression: parseable('IF {expr} THEN {number} ELSE {number}'),
	execute(sys: System, s: Statement) {
		if (sys.state !== SystemState.Execute)
			throw new Error('IF only in programs');

		const [expr, tlabel, elabel] = s.args as IfThenElseGotoArgs;
		sys.line = sys.evaluate(expr) ? tlabel.value : elabel.value;
		sys.statement = -1;
	},
	render(s: Statement) {
		const [expr, tlabel, elabel] = s.args as IfThenElseGotoArgs;
		return `IF ${r(expr)} THEN ${r(tlabel)} ELSE ${r(elabel)}`;
	},
};
