export interface ForClause {
	type: 'for';
	line: number;
	statement: number;
	v: string;
	end: number;
	step: number;
}

type Clause = ForClause;
export default Clause;
