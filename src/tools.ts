export function asBool(b: boolean) {
	return b ? -1 : 0;
}

export function isNum(v: any): v is number {
	return typeof v === 'number';
}

export function isStr(v: any): v is string {
	return typeof v === 'string';
}

export function isUndef(v: any): v is undefined {
	return typeof v === 'undefined';
}
