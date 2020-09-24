import System from '../System';
import Token from './Token';

export interface Fn {
	name: string;
	evaluate(sys: System, args: Token[]): number | string;
}
