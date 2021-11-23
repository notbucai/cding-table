/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-17 15:14:57
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-23 13:29:58
 * @Description:
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 安装成本太高了
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const smp = new SpeedMeasurePlugin()

const isProd = process.env.NODE_ENV === 'production'

/*
 * 是否使用生产环境的 vue
 */
const isVueProd = process.env.VUE_BUNDLE === 'production' || isProd
// const vueBundle = isVueProd ? 'vue.esm-browser.prod.js' : 'vue.esm-browser.js'
const isPlay = !!process.env.PLAY_ENV

const config = {
  mode: isProd ? 'production' : 'development',
  devtool: !isProd ? 'eval-source-map' : false,
  // target: 'node',
  entry: isPlay
    ? path.resolve(__dirname, './play.js')
    : path.resolve(__dirname, './entry.js'),
  output: {
    clean: true,
    path: path.resolve(__dirname, '../website-dist'),
    publicPath: '/',
    filename: isProd ? '[name].[contenthash:4].js' : '[name].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'ts-loader',
      //   options: {
      //     appendTsSuffixTo: [/\.vue$/],
      //     transpileOnly: true,
      //     configFile: path.resolve(__dirname, '../tsconfig.json'),
      //   },
      // },
      // {
      //   test: /\.(ts|js)x?$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      // },
      {
        test: /\.ts|\.tsx$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsxSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 2,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
          {
            loader: path.resolve(__dirname, './md-loader/index.js'),
          },
        ],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          // name: path.posix.join('static', '[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    alias: {
      crypto: false,
      vm: false,
      path: false,
      vue: '@vue/runtime-dom',
      main: path.resolve(__dirname, '../src'),
      examples: path.resolve(__dirname),
    },
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          // 从public中复制文件
          from: path.resolve(__dirname, 'public'),
          // 把复制的文件存放到dis里面
          to: path.resolve(__dirname, '../website-dist'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './website/public/index.tpl',
      filename: './index.html',
      favicon: './website/public/favicon.ico',
    }),

  ],
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-plus': 'ElementPlus',
    'highlight.js': 'hljs',
  },
  devServer: {
    inline: true,
    // 如果使用 vue 的生产环境构建包，无法启用 hmr
    // 因为生产环境下 vue 没有注入 hmr 必须的 __VUE_HMR_RUNTIME__ api
    hot: !isVueProd,
    stats: 'minimal',
    publicPath: '/',
    contentBase: __dirname,
    overlay: true,
  },
  optimization: {
    minimize: isProd,
    runtimeChunk: isProd,
    minimizer: isProd
      ?
      [
        new TerserPlugin({
          parallel: 4,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          parallel: 4,
        }),
      ]
      :
      [],
  },
}

const cssRule = {
  test: /\.(sass|scss|css)$/,
  use: [
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ],
}

if (isProd) {
  config.optimization.splitChunks = {
    // include all types of chunks
    chunks: 'all',
    // 重复打包问题
    cacheGroups: {
      vendors: {
        // node_modules里的代码
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        // name: 'vendors', 一定不要定义固定的name
        priority: 10, // 优先级
        enforce: true,
      },
    },
  }
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:4].css',
      chunkFilename: '[id].[contenthash:4].css',
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
    // new ImageMinimizerPlugin({
    //   minimizerOptions: {
    //     // Lossless optimization with custom option
    //     // Feel free to experiment with options for better result for you
    //     plugins: [
    //       ['gifsicle', { interlaced: true }],
    //       ['jpegtran', { progressive: true }],
    //       ['optipng', { optimizationLevel: 5 }],
    //     ],
    //   },
    // }),
  )
  cssRule.use.unshift({
    loader: MiniCssExtractPlugin.loader,
    options: {
      esModule: false,
    },
  })
} else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  cssRule.use.unshift('style-loader')
}
if (process.env.NODE_ANALYZER_ENV) {
  config.plugins.push(new BundleAnalyzerPlugin())
}
config.module.rules.push(cssRule)
module.exports = config
