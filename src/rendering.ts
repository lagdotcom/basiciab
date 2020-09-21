import Keywords from './Keywords';
import Line from './types/Line';
import Statement from './types/Statement';
import Token from './types/Token';

export default function render(t: Token): string {
	switch (t.type) {
		case 'variable':
			return t.name;

		case 'number':
			return t.value.toString();

		case 'string':
			return `"${t.value}"`;

		case 'binary':
			return `${render(t.args[0])} ${t.op} ${render(t.args[1])}`;
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
