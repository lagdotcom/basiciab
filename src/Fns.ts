import * as display from './functions/display';
import * as maths from './functions/maths';
import * as string from './functions/string';

const Fns = Object.fromEntries(
	[
		...Object.values(display),
		...Object.values(string),
		...Object.values(maths),
	].map(fn => [fn.name.toUpperCase(), fn])
);

export default Fns;
