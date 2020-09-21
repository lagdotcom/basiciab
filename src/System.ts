import Display from './Display';
import Vars from './Vars';

export default class System {
	display: Display;
	raf: number;
	vars: Vars;

	constructor(canvas: HTMLCanvasElement) {
		this.vars = new Vars();
		this.vars.add('__version$', {
			value: '',
			get() {
				return '0.1.0';
			},
		});

		this.display = new Display(this, canvas);

		this.tick = this.tick.bind(this);

		//console.log('System: started');
		this.raf = requestAnimationFrame(this.tick);
	}

	tick(t: number) {
		this.display.update();

		this.raf = requestAnimationFrame(this.tick);
	}
}
