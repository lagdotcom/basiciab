import Palette, { Black, DarkGrey, LightGrey } from './Palette';
import System from './System';
import Display from './types/Display';
import { Var } from './Vars';

export default class CanvasDisplay implements Display {
	bg!: Var<number>;
	border!: Var<number>;
	cols!: Var<number>;
	cx!: Var<number>;
	cy!: Var<number>;
	fg!: Var<number>;
	inner!: CanvasRenderingContext2D;
	innerCanvas!: HTMLCanvasElement;
	outer: CanvasRenderingContext2D;
	needsResize!: boolean;
	rows!: Var<number>;

	constructor(
		public outerCanvas: HTMLCanvasElement,
		public tileWidth: number = 8,
		public tileHeight: number = 8
	) {
		const outer = outerCanvas.getContext('2d');
		if (!outer) throw new Error('Could not get outer canvas context');
		this.outer = outer;
		outer.imageSmoothingEnabled = false;

		const outerResize = () => {
			const { clientWidth, clientHeight } = outerCanvas;

			outerCanvas.width = clientWidth;
			outerCanvas.height = clientHeight;
			//console.log(`Display: outer resized to ${clientWidth}x${clientHeight}`);
		};
		window.addEventListener('resize', outerResize);
		outerResize();
	}

	get pos() {
		return this.cx.value;
	}

	attach(sys: System) {
		const set = (v: Var<number>, value: number) => {
			v.value = value;
			this.needsResize = true;
		};

		const me = this;

		this.rows = sys.vars.add('__rows', { value: 40, system: true, set });
		this.cols = sys.vars.add('__cols', { value: 50, system: true, set });
		sys.vars.add('__width', {
			value: 0,
			system: true,
			get() {
				return me.cols.value * me.tileWidth;
			},
		});
		sys.vars.add('__height', {
			value: 0,
			system: true,
			get() {
				return me.rows.value * me.tileHeight;
			},
		});

		this.fg = sys.vars.add('__fg', { value: LightGrey, system: true });
		this.bg = sys.vars.add('__bg', { value: Black, system: true });
		this.border = sys.vars.add('__border', { value: DarkGrey, system: true });
		this.cx = sys.vars.add('__cx', { value: 0, system: true });
		this.cy = sys.vars.add('__cy', { value: 0, system: true });
		this.resize();
	}

	resize() {
		const width = this.cols.value * this.tileWidth;
		const height = this.rows.value * this.tileHeight;
		//console.log(`Display: inner resized to ${width}x${height}`);

		const innerCanvas = document.createElement('canvas');
		innerCanvas.width = width;
		innerCanvas.height = height;

		const inner = innerCanvas.getContext('2d');
		if (!inner) throw new Error('Could not get inner canvas context');

		inner.textAlign = 'center';
		inner.textBaseline = 'middle';
		inner.font = '8px monospace';
		inner.fillStyle = Palette[this.bg.value];
		inner.fillRect(0, 0, width, height);
		inner.imageSmoothingEnabled = false;
		this.cx.value = 0;
		this.cy.value = 0;

		this.inner = inner;
		this.innerCanvas = innerCanvas;
		this.needsResize = false;
	}

	update() {
		if (this.needsResize) this.resize();

		const { outer, innerCanvas, border, outerCanvas } = this;
		const { width, height } = outerCanvas;
		outer.fillStyle = Palette[border.value];
		outer.fillRect(0, 0, width, height);

		const w = innerCanvas.width;
		const h = innerCanvas.height;
		const wfits = Math.floor(width / w);
		const hfits = Math.floor(height / h);
		const zoom = Math.max(1, Math.min(wfits, hfits));
		const dw = w * zoom;
		const dh = h * zoom;

		const dx = Math.floor((width - dw) / 2);
		const dy = Math.floor((height - dh) / 2);
		outer.drawImage(innerCanvas, dx, dy, dw, dh);
	}

	write(s: string) {
		const { fg, bg, cols, cx, cy, inner, tileWidth, tileHeight } = this;

		for (var i = 0; i < s.length; i++) {
			const c = s[i];
			const x = cx.value * tileWidth;
			const y = cy.value * tileHeight;

			inner.fillStyle = Palette[bg.value];
			inner.fillRect(x, y, tileWidth, tileHeight);

			inner.fillStyle = Palette[fg.value];
			inner.fillText(c, x + tileWidth / 2, y + tileHeight / 2);

			cx.value++;
			if (cx.value >= cols.value) this.nl();
		}
	}

	nl() {
		const { cx, cy, rows } = this;

		cx.value = 0;
		cy.value++;

		if (cy.value >= rows.value) {
			cy.value = rows.value - 1;

			const { bg, inner, innerCanvas, tileHeight } = this;
			const sx = 0,
				sy = tileHeight,
				sw = innerCanvas.width,
				sh = innerCanvas.height - sy;
			const dx = 0,
				dy = 0,
				dw = sw,
				dh = sh;
			inner.drawImage(innerCanvas, sx, sy, sw, sh, dx, dy, dw, dh);

			inner.fillStyle = Palette[bg.value];
			inner.fillRect(0, sh, sw, tileHeight);
		}
	}

	bs() {
		const { cx } = this;

		if (cx.value > 0) {
			cx.value--;
			this.write(' ');
			cx.value--;
		}
	}

	line(x1: number, y1: number, x2: number, y2: number) {
		this.inner.strokeStyle = Palette[this.fg.value];
		this.inner.moveTo(x1, y1);
		this.inner.lineTo(x2, y2);
		this.inner.stroke();
	}
}
