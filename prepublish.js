/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-18 10:04:40
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-12 18:23:18
 * @Description: 发布专用脚本
 */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const inquirer = require('inquirer')
const ora = require('ora')
const colors = require('colors')
const semver = require('semver')

const pkg = require('./package.json')

const oldVersion = pkg.version

function savePackage(version) {
  pkg.version = version
  writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
}

function fallback (oldVersion,error) {
  savePackage(oldVersion)
  process.env.PUBLISH_STATUS = 0
  console.error(colors.red(error.stdout.toString()))
  //  eslint 检查失败，退出 恢复 package.json
  process.exit(1)
}

// // 验证状态
// if(process.env.PUBLISH_STATUS) return process.exit(0)
// process.env.PUBLISH_STATUS = 1

;(async ()=>{
  // 流程
  // 0. 确认是否发布
  const prompt = inquirer.createPromptModule()
  // const { publish } = await prompt({
  //   type: 'confirm',
  //   default: false,
  //   name: 'publish',
  //   message: '确认发布吗？',
  // })
  // if (!publish) {
  //   console.warn(colors.yellow(`已取消版本发布`))
  //   process.exit(1)
  // }
  // 1. 确认版本
  const { version: inputVersion } = await prompt({
    type: 'input',
    default: semver.inc(pkg.version, 'patch'),
    name: 'version',
    message: '请输入此次发布的版本(如: 1.0.0-dev)',
  })
  // 验证版本
  const validVersion = semver.valid(inputVersion)
  if(!validVersion){
    console.warn(colors.red(`输入的版本号无效`))
    process.exit(1)
  }
  if(!semver.gt(validVersion, pkg.version)){
    console.warn(colors.red(`版本号必须大于现在`))
    process.env.PUBLISH_STATUS = 0
    process.exit(1)
  }
  const { confirm: confirmPublish } = await prompt({
    type: 'confirm',
    name: 'confirm',
    message: `是否确认发布版本 ${colors.green(validVersion)}`,
  })
  if(!confirmPublish){
    console.warn(colors.red(`取消发布`))
    process.env.PUBLISH_STATUS = 0
    process.exit(1)
  }
  // 写入 package.json
  savePackage(validVersion)

  // 2. eslint
  const eslintOra = ora('eslint 检查中...').start()
  try {
    execSync(`yarn lint`)
    eslintOra.succeed('eslint 检查通过')
  } catch (error) {
    eslintOra.fail(colors.red('eslint 检查失败'))
    fallback(oldVersion,error)
  }

  // 3. build
  const buildOra = ora('build 构建中...').start()
  try {
    execSync(`yarn build`)
    buildOra.succeed('build 构建完成')
  } catch (error) {
    buildOra.fail(colors.red('build 构建失败'))
    // 回退
    fallback(oldVersion,error)
  }

  // 4. commit tag
  const commitOra = ora('commit 提交中...').start()
  try {
    execSync(`git add . && git commit -m "release: ${validVersion}"`)
    execSync(`git tag ${validVersion}`)
    commitOra.succeed('commit 提交完成')
  } catch (error) {
    commitOra.fail(colors.red('commit 提交失败'))
    // 回退
    fallback(oldVersion,error)
  }

  // // 4. publish
  // const publishOra = ora('publish 发布中...').start()
  // try {
  //   execSync(`npm publish`)
  //   publishOra.succeed('publish 发布完成')
  // } catch (error) {
  //   publishOra.fail(colors.red('publish 失败'))
  //   // 回退
  //   fallback(oldVersion,error)
  // }

  // process.exit(1)
})()
