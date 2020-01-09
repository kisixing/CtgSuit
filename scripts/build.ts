const webpack = require('webpack');
const slash = require('slash');

const path = require('path')
const compiler = webpack({
    mode: "production", // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: "app/main/index.js", // string | object | array
    // defaults to ./src
    // Here the application starts executing
    // and webpack starts bundling
    output: {
        // options related to how webpack emits results
        path: path.resolve(__dirname, "dist"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "bundle.js", // string
        // the filename template for entry chunks
        // publicPath: "/assets/", // string
        // the url to the output directory resolved relative to the HTML page

        // the type of the exported library
        /* Advanced output configuration (click to show) */
        /* Expert output configuration (on own risk) */
    },
    module: {
        // configuration regarding modules
        rules: [],
        /* Advanced module configuration (click to show) */
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)
        modules: [
            path.resolve(__dirname, "app/node_modules"),

            path.resolve(__dirname, "app")
        ],
        // directories where to look for modules
        extensions: [".js", ".json", ".jsx", ".css"],
        // extensions that are used
        /* Alternative alias syntax (click to show) */
        /* Advanced resolve configuration (click to show) */
    },
    performance: {
        hints: "warning", // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function (assetFilename) {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    // devtool: "source-map", // enum
    // enhance debugging by adding meta info for the browser devtools
    // source-map most detailed at the expense of build speed.
    context: path.resolve(__dirname,'..'), // string (absolute path!)
    // the home directory for webpack
    // the entry and module.rules.loader option
    //   is resolved relative to this directory
    target: "node", // enum
    // the environment in which the bundle should run
    // changes chunk loading behavior and available modules
    externals(context, request, callback) {

        // const getNodeExternal = target => `commonjs${target}`
        const getNodeExternal = target => `require("${target}")`
        const isDev = process.env.NODE_ENV === 'development';
        let isExternal;
        const load = ['electron', 'fs', 'path', 'os', 'url', 'child_process'];
        if (load.includes(request)) {
            isExternal = getNodeExternal(request);
        }
        const appDeps = Object.keys(require('../app/package').dependencies);
        if (appDeps.includes(request)) {
            const orininalPath = slash(path.join(__dirname, '../app/node_modules', request));
            const requireAbsolute = isDev ? orininalPath : request;
            isExternal = getNodeExternal(requireAbsolute)
        }
        callback(null, isExternal);
    },
    // Don't follow/bundle these modules, but request them at runtime from the environment

    // lets you provide options for webpack-serve
    stats: "errors-only",
    // lets you precisely control what bundle information gets displayed

    plugins: [
    ],
});

compiler.run((err, stats) => { // Stats Object
    console.log('err', err, stats)

});