module.exports = {
	entry: './src/index',
	plugins: [],
	output: {
		path: __dirname + '/docs',
		filename: 'main.js',
	},
	devtool: 'source-map',
	devServer: {
		static: './docs',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.(png|wav)$/,
				loader: 'file-loader',
				options: { name: '[name].[ext]' },
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{ test: /\.tsx?$/, loader: 'ts-loader' },
		],
	},
};
