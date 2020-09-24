import CanvasDisplay from './CanvasDisplay';
import './index.css';
import System from './System';

window.addEventListener('load', () => {
	const canvas = document.createElement('canvas');
	canvas.id = 'basiciab';
	document.body.appendChild(canvas);

	const display = new CanvasDisplay(canvas);
	const sys = new System(display);
	(window as any).sys = sys;

	sys.start();
});
