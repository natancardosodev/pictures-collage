const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    stats: 'normal',
    plugins: [
        new DashboardPlugin()
    ]
});
