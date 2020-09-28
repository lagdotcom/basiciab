export interface Var<T> {
	value: T;
	system?: boolean;
	get?: (v: Var<T>) => T;
	set?: (v: Var<T>, value: T) => void;
}

export default class Vars {
	vars: { [name: string]: Var<any> };

	constructor() {
		this.vars = {};
	}

	clear() {
		for (var name in this.vars) {
			if (!this.vars[name].system) delete this.vars[name];
		}
	}

	has(name: string) {
		return !!this.vars[name.toLowerCase()];
	}

	add<T>(name: string, v: Var<T>) {
		this.vars[name] = v;
		return v;
	}

	get<T>(name: string) {
		const v = this.vars[name.toLowerCase()] as Var<T>;
		if (!v) throw new Error(`Undefined var: ${name}`);

		if (v.get) return v.get(v);
		return v.value;
	}

	set<T>(name: string, value: T) {
		const v = this.vars[name.toLowerCase()] as Var<T>;
		if (!v) throw new Error(`Undefined var: ${name}`);

		if (v.set) v.set(v, value);
		else v.value = value;
	}
}
