export interface ForClause {
	type: 'for';
	line: number;
	statement: number;
	v: string;
	end: number;
	step: number;
}

export interface WhileClause {
	type: 'while';
	line: number;
	statement: number;
}

type Clause = ForClause | WhileClause;
export default Clause;
