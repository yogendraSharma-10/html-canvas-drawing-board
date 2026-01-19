```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Set the mode to 'development' or 'production'
    // 'development' mode enables useful tools for debugging, like source maps.
    // 'production' mode enables optimizations like minification.
    mode: isProduction ? 'production' : 'development',

    // Define the entry point(s) of the application.
    // Webpack starts bundling from these files.
    entry: {
      main: './src/main.js',
    },

    // Define how the output bundle and other assets are named and where they are placed.
    output: {
      // The output directory for all assets.
      path: path.resolve(__dirname, 'dist'),
      // The filename pattern for the JavaScript bundles.
      // `[name]` will be replaced by the entry point name (e.g., 'main').
      // `[contenthash]` ensures unique filenames for caching purposes.
      filename: 'js/[name].[contenthash].js',
      // The public path for all assets. Useful when assets are served from a CDN.
      publicPath: '/',
      // Cleans the `dist` folder before each build. This is an alternative to CleanWebpackPlugin.
      clean: true,
      // Specifies the base path for all generated assets.
      assetModuleFilename: 'assets/[name].[contenthash][ext]',
    },

    // Configure how different types of modules are treated.
    module: {
      rules: [
        // Rule for JavaScript files (ES6+ transpilation with Babel).
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // Rule for CSS files.
        // In development, 'style-loader' injects CSS into the DOM.
        // In production, 'MiniCssExtractPlugin.loader' extracts CSS into separate files.
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'), // Automatically adds vendor prefixes to CSS rules.
                  ],
                },
              },
            },
          ],
        },
        // Rule for images and other assets.
        // 'asset/resource' type emits a separate file and exports the URL.
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
        },
        // Rule for fonts.
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]',
          },
        },
      ],
    },

    // Configure how modules are resolved.
    resolve: {
      // Extensions to resolve. Allows importing modules without specifying their extensions.
      extensions: ['.js', '.json', '.css'],
      // Aliases for common paths, making imports cleaner.
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@assets': path.resolve(__dirname, 'public/assets/'),
      },
    },

    // Plugins are used to perform a wider range of tasks like bundle optimization, asset management, and injection of environment variables.
    plugins: [
      // Cleans the 'dist' folder before each build.
      new CleanWebpackPlugin(),

      // Generates an HTML file and injects the webpack bundles into it.
      new HtmlWebpackPlugin({
        template: './public/index.html', // Path to the source HTML template.
        filename: 'index.html',          // Output HTML filename.
        inject: 'body',                  // Where to inject the script tags (e.g., 'head', 'body').
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        } : false,
      }),

      // Extracts CSS into separate files for production builds.
      // This allows for parallel loading of CSS and JavaScript.
      isProduction && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
      }),

      // Copies individual files or entire directories to the build directory.
      // Useful for static assets that don't need to be processed by webpack loaders.
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/assets', // Source directory
            to: 'assets',          // Destination directory in 'dist'
            noErrorOnMissing: true, // Don't throw an error if the source is missing
          },
        ],
      }),

      // Loads environment variables from a .env file into process.env.
      // This is useful for managing configuration specific to different environments
      // and for referencing other services (e.g., API_URL for a Dynamic Color Palette Generator).
      new DotenvWebpackPlugin({
        path: `./.env${isProduction ? '.production' : ''}`, // Load .env or .env.production
        safe: true, // Load .env.example if it exists
        systemvars: true, // Allow system variables to override .env
        silent: true, // Suppress warnings
        defaults: false, // Load .env.defaults if it exists
      }),
    ].filter(Boolean), // Filter out any 'false' values from conditional plugins.

    // Optimization settings for production builds.
    optimization: {
      minimize: isProduction, // Enable minification.
      minimizer: [
        // For JavaScript minification.
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction, // Remove console.log in production.
            },
            format: {
              comments: false, // Remove comments.
            },
          },
          extractComments: false, // Do not extract comments to separate files.
        }),
        // For CSS minification.
        new CssMinimizerPlugin(),
      ],
      // Split chunks to optimize caching and reduce initial load time.
      splitChunks: {
        chunks: 'all', // Apply to all chunks.
        minSize: 20000, // Minimum size of a chunk to be considered for splitting.
        maxInitialRequests: 30, // Maximum number of parallel requests for the initial page load.
        maxAsyncRequests: 30, // Maximum number of parallel requests on-demand.
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // Group modules from node_modules into a 'vendors' chunk.
            name: 'vendors',
            chunks: 'all',
          },
          default: {
            minChunks: 2, // Minimum number of chunks that must share a module before splitting.
            priority: -20,
            reuseExistingChunk: true, // Reuse existing chunks if possible.
          },
        },
      },
    },

    // Webpack Dev Server configuration for local development.
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'), // Serve static files from 'public'.
      },
      compress: true, // Enable gzip compression for everything served.
      port: process.env.PORT || 8080, // Port to run the dev server on.
      open: true, // Open the browser after server starts.
      hot: true, // Enable Hot Module Replacement (HMR).
      historyApiFallback: true, // Fallback to index.html for HTML5 History API based routing.
      // Proxy requests to other services if needed, e.g., for cross-project communication.
      // proxy: {
      //   '/api/color-palette': {
      //     target: 'http://localhost:3001', // Assuming Dynamic Color Palette Generator runs on port 3001
      //     changeOrigin: true,
      //     secure: false,
      //   },
      //   '/api/markdown': {
      //     target: 'http://localhost:3002', // Assuming Live Markdown Editor runs on port 3002
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },

    // Source map configuration for debugging.
    // 'eval-source-map' is good for development, 'source-map' for production (more accurate but slower).
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Performance hints to warn about large bundles.
    performance: {
      hints: isProduction ? 'warning' : false, // Disable hints in development.
      maxEntrypointSize: 512000, // 500KB
      maxAssetSize: 512000, // 500KB
    },
  };
};
```