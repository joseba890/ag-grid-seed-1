/* * @type {import('webpack').Configuration} */

// import CompressionPlugin from 'compression-webpack-plugin';
// import CleanTerminalPlugin from 'clean-terminal-webpack-plugin';
// import TerserPlugin from 'terser-webpack-plugin';

// import { constants } from 'node:zlib';

const CompressionPlugin = require("compression-webpack-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const path = require("path");
const constants = require("node:zlib");

const isProduction = true; // process.env.NODE_ENV === 'production';

const stylesHandler = isProduction
    ? MiniCssExtractPlugin.loader
    : "style-loader";

const environment = process.env.NODE_ENV || "development";

const config = {
    // entry: ['./src/leaflet-2.js', './src/CT-Tax-Rates-2025.js'],
    entry: {
        // "Leaflet-2.0.0": "./src/leaflet-2.0.0.js",
        // "NH-Tax-Rates-": "./src/NH-Tax-Rates.js",
        "CT-Tax-Rates-2025": "./src/CT-Tax-Rates-2025.js",
    },
    output: {
        filename: "[name].bundle.js",
        // filename: './leaflet-2-jps.js',
        // libraryTarget: 'umd',
        assetModuleFilename: "images/[hash][ext][query]",
        iife: true,
        clean: true,
        compareBeforeEmit: false,
    },
    name: "leaflet-2.0.0-alpha",

    mode: "production",

    // publicPath: "",

    resolve: {
        extensions: [".ts", ".json", "..."],
    },
    devtool: "source-map",
    optimization: {
        // usedExports: true,

        concatenateModules: true,
        emitOnErrors: false,
        innerGraph: true,
        // mangleExports: false,
        minimize: true,
        minimizer: [
            // new EsbuildPlugin({
            // 	target: 'es2015', // Syntax to transpile to (see options below for possible values)
            // }),
            new TerserPlugin({
                extractComments: true,
                parallel: 8, // cpus().length - 1,

                terserOptions: {
                    compress: {
                        warnings: true,
                        unused: true,
                        dead_code: true,
                        ecma: 2020,
                        drop_debugger: true, // preserves debugger statements
                        drop_console: true,
                    },
                    format: {
                        comments: false, // 'some', // false, // include comments in output
                        // compress: true,
                        beautify: false,
                    },
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: true,
                },

                test: /\.m?js$/i,
            }),
            // new CssMinimizerPlugin({
            // 	test: /\.css$/i,
            // parallel: 4,
            // minimizerOptions: {
            // 	preset: [
            // 		{
            // 			discardComments: { removeAll: true },
            // 		},
            // 	],
            // },
            // }),
        ],
        moduleIds: "named",
        providedExports: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        sideEffects: false, // reduces the performance of webpack

        splitChunks: {
            chunks: "all", // 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                // default: {
                // 	minChunks: 2,
                // 	priority: -20,
                // 	reuseExistingChunk: true,
                // },
                leaflet: {
                    test: /[\\/]node_modules[\\/](leaflet)[\\/]/,
                    name: "leaflet",
                    chunks: "all",
                },
                /// CT-Tax-Rates-2025.json
                // json: {
                //     test: /json/,
                //     name: "CT-Tax-Rates-2025",
                //     chunks: "all",
                // },
            },
        },
    },

    // {
    // 	output: {
    // 		// path: path.resolve(__dirname, 'dist'),
    // 		filename: './createAgGrid-jps.js',
    // 		libraryTarget: 'commonjs',
    // 	},
    // 	name: 'commonjs',
    // 	entry: './src/createAgGrid.js',
    // 	mode: 'development',
    // }

    // target: 'web', // <=== can be omitted as default is 'web'

    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new CompressionPlugin({
            algorithm: "brotliCompress",
            compressionOptions: {
                params: {
                    // "constants.BROTLI_PARAM_QUALITY": 9,
                    // [constants.BROTLI_PARAM_QUALITY]: 9, // 11
                },
            },
            test: /\.(js|css)$/i,
            exclude: /node_modules/,
            minRatio: 0.8,
        }),
        new CleanTerminalPlugin({
            // message: 'FUX',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // server
            logLevel: "info", // "error",
            openAnalyzer: false,
            generateStatsFile: true,
            compressionAlgorithm: "brotli",
        }),
    ],

    module: {
        rules: [
            // {
            //     test: /\.(js|jsx)$/i,
            //     loader: "babel-loader",
            // },
            // {
            // 	test: /\.s[ac]ss$/i,
            // 	use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            // },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader", "postcss-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset/resource", // emits a separate file and exports the URL
            },

            {
                test: /\.(jsonXXX)$/,
                type: "asset/resource", // emits a separate file and exports the URL
                // type: "asset/source", // exports the source code of the asset
                // type: "asset/inline", // exports a data URI of the asset

                generator: {
                    filename: "static/[name][ext][query]",
                },

                // use: {
                //     loader: "file-loader",
                //     options: {
                //         name: "[path][name].[hash].[ext]",
                //     },
                // },
            },

            // {
            // 	test: /\.json$/,
            // 	type: 'asset/resource',
            // 	generator: {
            // 		filename: '[name][ext]', // This preserves the original filename and extension
            // 	},
            // },
            {
                test: /\.geojsonXX$/,
                type: "jsonXXX",
            },
            {
                test: /\.jsonXXX$/i,
                type: "javascriptXXX/auto", // Ensures webpack handles it as a JavaScript module
                // You can add loaders here if you need to process the JSON file,
                // for example, using 'json-loader' for older webpack versions or
                // a custom loader for specific transformations.
            },
            // {
            // 	test: /\.jsonXX$/,
            // 	loader: 'json-loader',
            // },
            // {
            // 	test: /\.html$/i,
            // 	use: ['html-loader'],
            // },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },

    devServer: {
        open: true,
        host: "localhost",
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";

        config.plugins.push(new MiniCssExtractPlugin());

        // config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = "development";
    }
    return config;
};

// export default config;
