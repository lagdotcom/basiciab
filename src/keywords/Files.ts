import System, { SystemState } from '../System';
import parse from '../parsing';
import parseSyntax from '../parseSyntax';

import Keyword from '../types/Keyword';
import { renderLine } from '../rendering';

export const Download: Keyword = {
	name: 'download',
	visible: 'DOWNLOAD',
	expression: parseSyntax('DOWNLOAD'),
	execute(sys: System) {
		if (sys.state !== SystemState.Interpret)
			throw new Error('UPLOAD not in programs');
		if (!sys.program.lines.length) throw new Error('Program is empty');

		const prog = sys.program.lines.map(renderLine).join('\n');
		const blob = new Blob([prog], { type: 'text/x-basic' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = sys.program.name;
		link.click();
	},
	render() {
		return 'DOWNLOAD';
	},
};

export const Upload: Keyword = {
	name: 'upload',
	visible: 'UPLOAD',
	expression: parseSyntax('UPLOAD'),
	execute(sys: System) {
		if (sys.state !== SystemState.Interpret)
			throw new Error('UPLOAD not in programs');

		document.querySelectorAll('.basiciab-upload').forEach(el => {
			el.remove();
		});

		const input = document.createElement('input');
		input.className = 'basiciab-upload';
		input.type = 'file';
		input.addEventListener('change', () => {
			if (!input || !input.files) return;
			const file = input.files[0];
			const fr = new FileReader();
			fr.addEventListener('load', e => {
				sys.display.write(`Received ${e.loaded} bytes... `);
				sys.program = { name: file.name, lines: [] };
				const prog = fr.result as string;

				prog.split(/[\n\r]/).forEach(raw => {
					input.remove();
					const trimmed = raw.trim();
					if (!trimmed) return;

					const line = parse(trimmed);
					if (line.label === null) sys.runStatement(line);
					else sys.add(line);
				});

				sys.display.writenl(`${file.name} ready`);
			});
			fr.readAsText(file);
		});

		// this works in Chrome, but not Firefox
		input.click();
		// ...so let Firefox users click the button manually
		document.body.prepend(input);
	},
	render() {
		return 'UPLOAD';
	},
};
