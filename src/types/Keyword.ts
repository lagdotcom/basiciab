import { ParsingExpression } from '../parsing';
import System from '../System';
import Statement from './Statement';

export default interface Keyword {
	name: string;
	expression: ParsingExpression;
	execute(sys: System, s: Statement): void;
	render(s: Statement): string;
}
