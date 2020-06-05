const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssestsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const srcPath = "./wwwroot/src/js";
const entries = {
    index: "./wwwroot/src/js/index.js"
};

fs.readdirSync(srcPath).forEach((name) => {
    const indexFile = `${srcPath}/${name}/index.js`;
    if (fs.existsSync(indexFile)) {
        entries[name] = indexFile;
    }
});

module.exports = {
    mode: "development", // The mode of configuration
    entry: entries, // Our entry object that contains all entries founded
    output: {
        path: path.resolve(__dirname, "./wwwroot/dist"),
        filename: "js/[name].js",
        publicPath: "/dist/",
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ cache: true, parallel: true, sourceMap: true }),
            new OptimizeCssAssestsPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "css/[name].css" }), //this will extract all css to this file
        new CopyWebpackPlugin({ patterns: [{ from: 'wwwroot/src/img', to: 'img' }] }), //copiar imagens
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        rules: [
            {
                // this will load and build all scss, making a css file
                test: /\.scss$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }, { loader: "sass-loader" }]
            },
            {
                // this will load all js files, transpile to es5
                test: "/\.js$/",
                exclude: /(node_modules)/,
                use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
            },
            //{
            //    test: /\.(jpe?g|png|gif|svg)$/,
            //    loaders: ["file-loader"]
            //},
            //{
            //    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            //    use: [{ loader: "file-loader", options: { name: "[name].[ext]", outputPath: "fonts/" } }]
            //}
        ]
    },
    resolve: {
        alias: {
            // this makes webpack loads the development file, not the esm that can't be debugged on Chrome
            vue: "vue/dist/vue.js"
        }
    }
};