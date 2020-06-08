const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssestsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const srcPath = "./wwwroot/src/js";
const entries = {
    index: "./wwwroot/src/js/index.js"
};

// create a entry for all index.js file at js directory inside wwwroot/src/js
// that way, we create multiples 
fs.readdirSync(srcPath).forEach((name) => {
    const indexFile = `${srcPath}/${name}/index.js`;
    if (fs.existsSync(indexFile)) {
        entries[name] = indexFile;
    }
});

module.exports = {
    mode: process.env.NODE_ENV,

    entry: entries,

    output: {
        path: path.resolve(__dirname, "./wwwroot/dist"),
        filename: "js/[name].js",
        publicPath: "/dist/",
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: { ecma: 6 }
            }),
            new OptimizeCssAssestsPlugin()
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: "css/[name].css" }), //this will extract css files imported in js files
        new CopyWebpackPlugin({ patterns: [{ from: 'wwwroot/src/img', to: 'img' }] }), // copy images
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
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loaders: ["file-loader"]
            },
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
    },

    devServer: {
        compress: true,
        proxy: {
            '*': {
                target: "http://localhost:8082"
            }
        },
        port: "8081"
    }
};