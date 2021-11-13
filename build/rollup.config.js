/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-18 09:36:07
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-13 10:39:18
 * @Description: 
 */
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { eslint } from "rollup-plugin-eslint"
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import pkg from '../package.json'
import scss from 'rollup-plugin-scss';

const deps = Object.keys(pkg.dependencies)
// eslint-disable-next-line @typescript-eslint/no-var-requires
import vue from 'rollup-plugin-vue';
// const prettier = require('rollup-plugin-prettier');

const minify = false
const banner = `/*! Cding Table v${pkg.version} */\n`

export default [{
  input: path.resolve(
    __dirname,
    '../src/index.ts'
  ),
  rootDir:"src",
  output: [
    {
      format: 'es',
      file: 'lib/index.js',
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
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(__dirname, '../lib',
        `index.full${minify ? '.min' : ''}.mjs`
      ),
      sourcemap: minify,
      banner,
    }
  ],
  // rootDir: 'src',
  plugins: [
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
}]
