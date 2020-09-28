import CanvasDisplay from './CanvasDisplay';
import DocumentInput from './DocumentInput';
import './index.css';
import System from './System';

window.addEventListener('load', () => {
	const canvas = document.createElement('canvas');
	canvas.id = 'basiciab';
	document.body.appendChild(canvas);

	const display = new CanvasDisplay(canvas);
	const input = new DocumentInput();
	const sys = new System(display, input);
	(window as any).sys = sys;

	sys.start();
});
