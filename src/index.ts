import './index.css';
import System from './System';

window.addEventListener('load', () => {
	const canvas = document.createElement('canvas');
	canvas.id = 'basiciab';

	document.body.appendChild(canvas);

	const sys = new System(canvas);
	(window as any).sys = sys;
});
