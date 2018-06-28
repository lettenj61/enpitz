const { mkdirSync } = require('fs')

const logger = require('consola')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const moment = require('moment')

let db = null

function initDb (config) {
  if (!config.hasHomeDir()) {
    mkdirSync(config.homeDir)
  }
  if (db == null) {
    const adapter = new FileSync(config.getSource())
    db = low(adapter)

    db.defaults({ notes: [] })
      .write()
  }
}

function addPost (config, text) {
  initDb(config)
  const source = config.getSource()

  try {
    db.get('notes')
      .push({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        text
      })
      .write()
  
    logger.success('Successfully saved note: `' + text + '` at ' + source)
  } catch (err) {
    logger.error('Failed to store note to [' + source + ']')
    logger.error(err)
  }
}

function showPosts (source, notes) {
  logger.start(`Showing ${notes.length} note(s) from ${source} ...`)
  notes.forEach(note => {
    console.log(`[${note.time}]: ${note.text}`)
  })
  logger.success('Done.')
}

function getPosts (config, date) {
  const parsed = moment(date)
  if (parsed.isValid()) {
    config.setDate(parsed)
  }
  let notesTaken = true
  let notes = null
  if (!config.hasSource()) {
    notesTaken = false
  } else {
    initDb(config)
    notes = db.get('notes')
      .sortBy('time')
      .value()
  }

  if (notesTaken && notes && notes.length) {
    showPosts(config.getSource(), notes)
  } else {
    logger.info('No notes were taken for [' + config.date + ']')
  }
}

exports.addPost = addPost
exports.getPosts = getPosts
