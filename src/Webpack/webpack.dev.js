const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
module.exports = merge(common, {
	mode: "development",
	output: {
		filename: "js/[name].js",
		pathinfo: false,
	},

	plugins: [
		new MiniCssExtractPlugin({ filename: "css/[name].css" }),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true, // If you are using the options api.
			__VUE_PROD_DEVTOOLS__: true // If you don't want people sneaking around your components in production.
		}),
	],

	devtool: "inline-source-map",

	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
});
