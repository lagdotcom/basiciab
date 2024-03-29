import { ParsingExpression } from '../parseSyntax';
import System from '../System';
import Statement from './Statement';

export default interface Keyword {
	name: string;
	visible?: string;
	expression: ParsingExpression;
	execute(sys: System, s: Statement): void;
	render(s: Statement): string;
}
