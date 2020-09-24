import Keywords from './Keywords';
import Line from './types/Line';
import Statement from './types/Statement';
import Token, { BinaryOp } from './types/Token';

const precedence: { [op in BinaryOp]: number } = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
};

export default function render(t: Token, parent: number = 0): string {
	switch (t.type) {
		case 'variable':
			return t.name;

		case 'number':
			return t.value.toString();

		case 'string':
			return `"${t.value}"`;

		case 'binary':
			const [left, right] = t.args;
			const prec = precedence[t.op];
			const base = `${render(left, prec)} ${t.op} ${render(right, prec)}`;
			if (prec < parent) return `(${base})`;
			return base;

		case 'fn':
			return `${t.name.toUpperCase()}(${t.args.map(render).join(', ')})`;
	}
}

export function renderStatement(s: Statement): string {
	const keyword = Keywords[s.keyword];
	if (!keyword) throw new Error(`Unknown keyword: ${s.keyword}`);
	return keyword.render(s);
}

export function renderLine(l: Line): string {
	return `${l.label} ${l.statements.map(renderStatement).join(' : ')}`;
}
