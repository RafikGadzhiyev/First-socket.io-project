const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'main.bundle.js': path.join(__dirname, 'scripts/main.js')
    },
    output: {
        path: path.join(__dirname, 'build/'),
        filename: '[name]-[contenthash].js',
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'build/')
        },
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                    }
                }
            },
            {
                test: /\.s(c|a)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Test",
            template: path.join(__dirname, 'index.html')
        })
    ]
}