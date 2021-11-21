/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-18 09:36:07
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-21 18:42:11
 * @Description: 
 */
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { eslint } from "rollup-plugin-eslint"
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import scss from 'rollup-plugin-scss';
import { uglify } from "rollup-plugin-uglify";

import pkg from '../package.json'
const deps = Object.keys(pkg.dependencies)
// eslint-disable-next-line @typescript-eslint/no-var-requires
import vue from 'rollup-plugin-vue';
// const prettier = require('rollup-plugin-prettier');

const minify = process.env.NODE_ENV === 'production'
const banner = `/*! Cding Table v${pkg.version} */\n`

export default {
  input: path.resolve(
    __dirname,
    '../src/index.ts'
  ),
  output: [
    {
      format: 'esm',
      file: 'lib/index.js',
      sourcemap: minify,
      banner,
    },
    {
      format: 'cjs',
      file: 'lib/index.cjs.js',
      sourcemap: minify,
      banner,
    },
    {
      format: 'umd',
      file: path.resolve(
        __dirname, '../lib',
        `index.full${minify ? '.min' : ''}.js`
      ),
      exports: 'named',
      name: 'CdingTable',
      globals: {
        vue: 'Vue',
        'element-plus': 'ElementPlus',
      },
      sourcemap: minify,
      banner,
    }
  ],
  // rootDir: 'src',
  plugins: [
    del({
      targets: ['lib/*']
    }),
    // 压缩
    uglify(),
    // 编译
    eslint(),
    // prettier(),
    babel({ babelHelpers: "bundled", extensions: [".ts", ".js", ".tsx", '.jsx'] }), // babelHelpers是babel的最佳实践方案 extensions编译的扩展文件
    // terser(),
    nodeResolve(),
    // commonjs(),
    scss(),
    vue({
      target: 'browser',
      css: false,
      exposeFilename: false,
    }),
    typescript({
      tsconfigOverride: {
        'include': [
          'src/**/*',
          'typings/vue-shim.d.ts',
        ],
        'exclude': [
          'lib',
          'coverage',
          'node_modules',
          'src/**/__tests__/*',
          'src/__tests__/*',
        ],
      },
      abortOnError: false,
    }),
  ],
  external (id) {
    return /^vue/.test(id)
      || deps.some(k => new RegExp('^' + k).test(id))
  },
}
