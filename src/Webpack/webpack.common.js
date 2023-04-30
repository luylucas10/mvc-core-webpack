const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const scripts = {
	// initial point, we use to load layout and base libraries
	index: "./wwwroot/src/js/index.js",
};

module.exports = {
	// load all .js files presents in the directory
	entry: glob
		.sync("./wwwroot/src/js/**/*.js")
		.reduce(function (obj, el) {
			obj[path.parse(el).name] = `./${el}`;
			return obj;
		}, scripts),
	// set output directory, I like to clean every build
	output: {
		path: path.resolve(__dirname, "./wwwroot/dist"),
		publicPath: "/dist/",
		clean: true
	},
	// set output of webpack build stats
	stats: {
		preset: "none",
		assets: true,
		errors: true,
	},
	plugins: [
		new VueLoaderPlugin(),
		// copy all images to output dir
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "./wwwroot/src/img"),
					to: path.resolve(__dirname, "./wwwroot/dist/img")
				},
			],
		}
		),
	],

	module: {
		rules: [
			{
				// this will load and build all scss, making a css file
				test: /\.((sa|sc|c)ss)$/i,
				use: [
					miniCssExtractPlugin.loader,
					"css-loader",
					"resolve-url-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: function () {
									return [
										require("autoprefixer")
									];
								}
							}
						}
					},
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass")
						}
					}
				]
			},
			{
				// this will load all js files, transpile to es5
				test: /\.js$/,
				include: path.resolve(__dirname, './wwwroot/src/js'),
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			},
			{
				//case sass files have images references, webpack will copy
				test: /\.(jpe?g|png|gif|svg)$/,
				include: path.resolve(__dirname, './wwwroot/src/img'),
				type: "asset/resource",
				generator: {
					filename: "img/[name].[ext]"
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource",
				generator: {
					filename: "fonts/[name].[ext]"
				}
			},
			{
				test: /\.vue$/,
				loader: "vue-loader"
			}
		]
	},

	resolve: {
		alias: {
			// use vue es module version
			vue: "vue/dist/vue.esm-bundler.js"
		}
	},
};
