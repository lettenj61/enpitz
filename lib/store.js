const { mkdirSync } = require('fs')

const logger = require('consola')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const moment = require('moment')

const { wrapMarkdown } = require('./render.js')

const momentDocsUrl = 'https://momentjs.com/docs/#/parsing/string/'

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

function runWithNotes (config, date, onSuccess) {
  if (date) {
    let parsed = null
    try {
      parsed = moment(date)
    } catch (_err) {}
    if (moment.isMoment(parsed) && parsed.isValid()) {
      config.setDate(parsed)
    } else {
      logger.error('Given datetime spec `' + date + '` is not valid format.')
      logger.error('Please refer to Moment.js documentation for date parsing.')
      logger.error('(' + momentDocsUrl + ')')
      return
    }
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
    onSuccess(notes)
  } else {
    logger.info('No notes were taken for [' + config.date + ']')
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

    if (!config.silent) {
      logger.success('Successfully saved note: `' + text + '` at ' + source)
    }
  } catch (err) {
    logger.error('Failed to store note to [' + source + ']')
    logger.error(err)
  }
}

function showPosts (source, notes, verbose) {
  if (verbose) {
    logger.start(`Showing ${notes.length} note(s) from ${source} ...`)
  }
  notes.forEach(note => {
    console.log(`[${note.time}]: ${note.text}`)
  })
  if (verbose) {
    logger.success('Done.')
  }
}

function getPosts (config, date) {
  runWithNotes(config, date, notes => {
    showPosts(config.getSource(), notes, config.verbose)
  })
}

function renderPosts (config, date) {
  runWithNotes(config, date, notes => {
    switch (config.format) {
      case 'json':
        console.log(JSON.stringify({ [config.date]: notes }, null, config.indent || 2))
        logger.success('Done.')
        break
      case 'markdown':
      case 'md':
        const content = wrapMarkdown({
          title: `Notes ${config.date}`,
          heading: '##'
        }, notes)

        if (content === '') {

        } else {
          console.log(content)
          console.log('')
          logger.success('Done.')
        }
        break
      default:
        logger.error('Unknown format: ' + config.format)
    }
  })
}

exports.addPost = addPost
exports.getPosts = getPosts
exports.renderPosts = renderPosts
