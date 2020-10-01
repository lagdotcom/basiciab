import parse, { parseable } from '../parsing';
import { renderLine } from '../rendering';
import System, { SystemState } from '../System';
import Keyword from '../types/Keyword';

export const Download: Keyword = {
	name: 'download',
	visible: 'DOWNLOAD',
	expression: parseable('DOWNLOAD'),
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
	expression: parseable('UPLOAD'),
	execute(sys: System) {
		if (sys.state !== SystemState.Interpret)
			throw new Error('UPLOAD not in programs');

		const input = document.createElement('input');
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
		input.click();
	},
	render() {
		return 'UPLOAD';
	},
};
