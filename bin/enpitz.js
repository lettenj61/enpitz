#!/usr/bin/env node

const program = require('commander')

const Config = require('../lib/configure.js')
const store = require('../lib/store.js')

const config = new Config()

program.version('0.1.0')

program.command('add <note>')
  .description('Save a note to storage')
  .action(note => {
    store.addPost(config, note)
  })

program.command('list [date]')
  .description('Show notes saved in specific date (default: today)')
  .action(date => {
    store.getPosts(config, date)
  })

program.parse(process.argv)
