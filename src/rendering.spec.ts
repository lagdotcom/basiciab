import { assert } from 'chai';
import { renderLine } from './rendering';
import Line from './types/Line';

describe('rendering', () => {
	it('should render a simple program', () => {
		const expected = [
			'10 t = 0 : LET a = 2',
			'20 FOR x = a - 1 TO 5 STEP 3',
			'30 t = t + x',
			'40 NEXT',
		].join('\n');
		const lines: Line[] = [
			{
				label: 10,
				statements: [
					{
						keyword: 'let-implicit',
						args: [
							{ type: 'variable', name: 't' },
							{ type: 'number', value: 0 },
						],
					},
					{
						keyword: 'let',
						args: [
							{ type: 'variable', name: 'a' },
							{ type: 'number', value: 2 },
						],
					},
				],
			},
			{
				label: 20,
				statements: [
					{
						keyword: 'for-step',
						args: [
							{ type: 'variable', name: 'x' },
							{
								type: 'binary',
								op: '-',
								args: [
									{ type: 'variable', name: 'a' },
									{ type: 'number', value: 1 },
								],
							},
							{ type: 'number', value: 5 },
							{ type: 'number', value: 3 },
						],
					},
				],
			},
			{
				label: 30,
				statements: [
					{
						keyword: 'let-implicit',
						args: [
							{ type: 'variable', name: 't' },
							{
								type: 'binary',
								op: '+',
								args: [
									{ type: 'variable', name: 't' },
									{ type: 'variable', name: 'x' },
								],
							},
						],
					},
				],
			},
			{
				label: 40,
				statements: [{ keyword: 'next-implicit', args: [] }],
			},
		];

		assert.equal(lines.map(renderLine).join('\n'), expected);
	});
});
