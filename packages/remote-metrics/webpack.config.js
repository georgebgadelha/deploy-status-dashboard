const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { container } = webpack;
const { withZephyr } = require('zephyr-webpack-plugin');

const { ModuleFederationPlugin } = container;

/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteMetrics',
      filename: 'remoteEntry.js',
      exposes: {
        './MetricsWidget': './src/components/MetricsWidget',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      // Inject env vars separately for backwards compatibility
      'process.env.ZE_PUBLIC_API_BASE_URL': JSON.stringify(process.env.ZE_PUBLIC_API_BASE_URL || 'https://zephyr-deploy-bff.onrender.com/api/v1'),
      'process.env.ZE_PUBLIC_API_KEY': JSON.stringify(process.env.ZE_PUBLIC_API_KEY || 'zephyr-dev-api-key-2024'),
      // Inject process object as JavaScript code (not stringified JSON)
      'process': JSON.stringify({
        env: {
          ZE_PUBLIC_API_BASE_URL: process.env.ZE_PUBLIC_API_BASE_URL || 'https://zephyr-deploy-bff.onrender.com/api/v1',
          ZE_PUBLIC_API_KEY: process.env.ZE_PUBLIC_API_KEY || 'zephyr-dev-api-key-2024',
        },
      }),
    }),
  ],
  devServer: {
    port: 3002,
    hot: true,
  },
};

module.exports = withZephyr()(config);
