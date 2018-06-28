#!/usr/bin/env node

const program = require('commander')

const packageJson = require('../package.json')
const Config = require('../lib/configure.js')
const store = require('../lib/store.js')

const config = new Config()
let handled = false

program.version(packageJson.version || '0.1.0-SNAPSHOT')

program.command('add <note>')
  .description('take a new note')
  .option('-s, --silent', 'suppress result notification')
  .action((note, cmd) => {
    handled = true
    config.silent = cmd.silent
    store.addPost(config, note)
  })

program.command('dir')
  .description('show enpitz home directory')
  .action(() => {
    handled = true
    console.log(config.homeDir)
  })

program.command('list [date]')
  .description('show notes saved in specific date (default: today)')
  .option('-v, --verbose', 'print verbose information of notes')
  .action((date, cmd) => {
    handled = true
    config.verbose = cmd.verbose
    store.getPosts(config, date)
  })

program.command('render [date]')
  .description('render saved notes')
  .option('-o, --output [file]', 'write rendered string in given file')
  .option('-v, --verbose', 'print verbose information')
  .option(
    '-f, --format [type]',
    'specify output format (markdown|md|json)',
    /^(markdown|md|json)$/i,
    'markdown'
  )
  .action((date, cmd) => {
    handled = true
    config.format = cmd.format
    config.output = cmd.output
    config.verbose = cmd.verbose
    store.renderPosts(config, date)
  })

program.parse(process.argv)

if (!handled) {
  const command = process.argv[2]
  if (command && command.length)  {
    console.log('')
    console.log('  error: unknown command `' + command + '`')
  }
  program.outputHelp()
}
