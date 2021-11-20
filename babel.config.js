module.exports = {
  presets: [
    [
      '@babel/env',
      {
        // loose: true,
        modules: false,
      },
    ],
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: false,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    // '@babel/proposal-class-properties',
    // '@babel/transform-runtime',
    // [
    //   'import',
    //   {
    //     libraryName: 'element-plus',
    //     customStyleName: name => {
    //       name = name.slice(3)
    //       return `element-plus/packages/theme-chalk/src/${name}.scss`
    //     },
    //   },
    // ],
  ],
}
