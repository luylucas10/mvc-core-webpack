const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const webpack = require("webpack");

module.exports = merge(common, {
	mode: "production",
	output: {
		filename: "js/[name].[chunkhash].js",
		clean: true
	},
	devtool: false,
	plugins: [
		new MiniCssExtractPlugin({ filename: "css/[name].[chunkhash].css" }),
		// this plugin generates integrity of files and put in stats file
		new WebpackAssetsManifest({
			integrity: true,
			integrityHashes: ["sha256"]
		}),
		new webpack.SourceMapDevToolPlugin({
			test: /\.((sa|sc|c)ss)$/i,
		}),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true, // If you are using the options api.
			__VUE_PROD_DEVTOOLS__: false // If you don't want people sneaking around your components in production.
		}),
	],
	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
});
