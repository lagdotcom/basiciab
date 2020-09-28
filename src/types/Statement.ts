import Token from './Token';

export default interface Statement {
	label: null;
	keyword: string;
	args: Token[];
}
