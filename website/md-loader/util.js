/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const compiler = require('@vue/compiler-sfc')

function stripScript (content) {
  const result = content.match(/<(script) ?(?:lang="[tj]sx?")? ?(?:setup)?>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

function stripStyle (content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate (content) {
  content = content.trim()
  if (!content) {
    return content
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()
}

function pad (source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n')
}

const templateReplaceRegex = /<template>([\s\S]+)<\/template>/g

/**
 *
 * @param {*} template
 * @param {string} script
 * @param {*} id
 * @returns
 */
function genInlineComponentText (template, script, id) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  let source = template
  if (templateReplaceRegex.test(source)) {
    source = source.replace(templateReplaceRegex, '$1')
  }
  const finalOptions = {
    id: id,
    source: `<div>${source}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    // compiler: TemplateCompiler,
    compilerOptions: {
      mode: 'function',
    },
  }
  const compiled = compiler.compileTemplate(finalOptions)
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip)
    })
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
      compiled.errors.map(e => `  - ${e}`).join('\n') +
      '\n',
    )
  }
  let demoComponentContent = `
    ${(compiled.code).replace('return function render', 'function render')}
  `
  // todo: 这里采用了硬编码有待改进
  script = script.trim()
  if (script) {
    script = script
      .replace(/export\s+default/, 'const democomponentExport =')
      .replace(/exports\["default"\]/, 'const democomponentExport')
      .replace(/import ({.*}) from ['"]vue['"]/g, (s, s1) => {
        s1 = s1.replace(/ as /g, ':')
        return `const ${s1} = Vue`
      })
      .replace(/createVNode:_createVNode,?/, '')
      .replace(/_createTextVNode/g, '__createTextVNode')
      .replace(/resolveComponent:_resolveComponent,?/, '')
      .replace(/import (.*) from ['"](.*)['"]/g, (s, s1, s2) => `const ${s1} = require('${s2}')`)
      .replace(/import ({.*}) from ['"]element-plus['"]/g, (s, s1) => `const ${s1} = require('element-plus')`)
  } else {
    script = 'const democomponentExport = {}'
  }
  demoComponentContent = `(function() {
    const exports = {};
    ${demoComponentContent}
    ${script}
    return {
      render,
      ...democomponentExport
    }
  })()`
  return demoComponentContent
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText,
}
