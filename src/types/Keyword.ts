import Statement from './Statement';

export default interface Keyword {
	name: string;
	render(s: Statement): string;
}
