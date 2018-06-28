#!/usr/bin/env node

const program = require('commander')

const Config = require('../lib/configure.js')
const store = require('../lib/store.js')

const config = new Config()

program.version('0.1.0')

program.command('add <note>')
  .description('Save a note to storage')
  .option('-s, --silent', 'Suppress result notification')
  .action((note, cmd) => {
    config.silent = cmd.silent
    store.addPost(config, note)
  })

program.command('list [date]')
  .description('Show notes saved in specific date (default: today)')
  .option('-v, --verbose', 'Print verbose information of notes')
  .action((date, cmd) => {
    config.verbose = cmd.verbose
    store.getPosts(config, date)
  })

program.command('render [date]')
  .description('Render saved notes')
  .option('-o, --output [file]', 'Write rendered string into given file')
  .option(
    '-f, --format [type]',
    'Specify output format (markdown|md|json)',
    /^(markdown|md|json)$/i,
    'markdown'
  )
  .action((date, cmd) => {
    config.format = cmd.format
    store.renderPosts(config, date)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
