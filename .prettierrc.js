/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-18 16:24:25
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-08-18 16:24:25
 * @Description: 
 */
module.exports = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.scss',
      options: {
        parser: 'scss',
      },
    },
  ],
}