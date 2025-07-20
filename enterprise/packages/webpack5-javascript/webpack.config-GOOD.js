/** @type {import('webpack').Configuration} */

/** @type {import('terserOptions').CompressOptions} */
/** @type {import('TerserPlugin').CompressOptions} */

/** @type {import('terser').CompressOptions} */
/** @type {import('terser').FormatOptions} */
/** @type {import('terser').MangleOptions} */
/** @type {import('terser').MinifyOptions} */
/** @type {import('terser').ParseOptions} */
/** @type {import('terser').SourceMapOptions} */

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { constants } from "node:zlib";

import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanTerminalPlugin from "clean-terminal-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    // entry: './src/index.js',
    // entry: './src/index.ts',

    entry: {
        "ag-grid-jps": "./src/index.ts", // index.js
        createAgGrid: "./src/createAgGrid.js",
        "leaflet-2": "./src/leaflet-2.js",
    },

    output: {
        clean: true,
        compareBeforeEmit: false,

        // path: path.resolve('D:/Work/NGINX-2/html/Scripts/libs/ag-grid/jps/webpack'),
        path: path.resolve(__dirname, "dist"), // Using the ESM equivalent of __dirname

        // filename: 'ag-grid-jps.js',
        filename: "[name].js",

        // library: 'agGrid',
        library: {
            name: "agGrid",
            type: "umd", // 'umd',
        },
    },

    // mode: 'production',

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                // 		// if using plain CSS:
                use: ["style-loader", "css-loader"],
                // 		// if using sass:
                // 		// use: ["style-loader", "css-loader", "sass-loader"]
                // exclude: /(node_modules)/,
                // test: /\.jsx?$/,
                // loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
        mangleExports: "size", // true,
        minimize: true,
        minimizer: [
            // `...`,
            new TerserPlugin({
                // https://webpack.js.org/plugins/terser-webpack-plugin/

                /*
				exclude
				extractComments
				include
				minify
				parallel
				terserOptions
				test
				*/

                exclude: /\/excludes/,
                extractComments: false,
                // include: /\/includes/,
                // minify: true,
                parallel: 8, // cpus().length - 1,
                test: /\.m?js(\?.*)?$/i,

                // see https://terser.org/docs/api-reference/#minify-options-structure
                // see https://github.com/terser/terser?tab=readme-ov-file#minify-options-structure
                /*
				type terserOptions = {
					compress?: boolean | CompressOptions;
					ecma?: ECMA;
					enclose?: boolean | string;
					ie8?: boolean;
					keep_classnames?: boolean | RegExp;
					keep_fnames?: boolean | RegExp;
					mangle?: boolean | MangleOptions;
					module?: boolean;
					nameCache?: object;
					format?: FormatOptions;
					// @deprecated
					output?: FormatOptions;
					parse?: ParseOptions;
					safari10?: boolean;
					sourceMap?: boolean | SourceMapOptions;
					toplevel?: boolean;
				};
				*/
                terserOptions: {
                    compress: {
                        drop_console: true,
                        warnings: true,
                        unused: true,
                        dead_code: true,
                    },
                    ecma: 2016,
                    // enclose: ,
                    ie8: false,
                    keep_classnames: false,
                    keep_fnames: false, // when true, prevents mangling of all function names
                    mangle: true,

                    format: {
                        comments: false,
                    },
                },
            }),
        ],
        usedExports: true,
    },

    // experiments: {
    // 	outputModule: true,
    // },
    performance: {
        hints: "warning", // should be false, 'warning', or 'error'
    },
    plugins: [
        new CleanTerminalPlugin({
            // message: 'FUX',
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            favicon: "src/favicon.ico",
        }),
        new CompressionPlugin({
            algorithm: "brotliCompress",
            compressionOptions: {
                params: {
                    [constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            test: /\.(js|css)$/i,
            exclude: /node_modules/,
            minRatio: 0.8,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // server
            logLevel: "error",
            openAnalyzer: false,
            generateStatsFile: true,
            compressionAlgorithm: "brotli",
        }),
    ],
    watch: true,
};

export default config;
