import './index.css';

import CanvasDisplay from './CanvasDisplay';
import DocumentInput from './DocumentInput';
import System from './System';

window.addEventListener('load', () => {
	const canvas = document.createElement('canvas');
	canvas.id = 'basiciab';
	document.body.appendChild(canvas);

	const display = new CanvasDisplay(canvas, 8, 16, 12, 30, 80);
	const input = new DocumentInput();
	const sys = new System(display, input);
	(window as any).sys = sys;

	sys.start();
});
