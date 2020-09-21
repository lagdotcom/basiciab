import Token from './Token';

export default interface Statement {
	keyword: string;
	args: Token[];
}
