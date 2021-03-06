const { mkdirSync, writeFileSync } = require('fs')

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
    logger.info('no notes were taken for [' + config.date + ']')
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
      logger.success('saved note: `' + text + '` at ' + source)
    }
  } catch (err) {
    logger.error('failed to store note to [' + source + ']')
    logger.error(err)
  }
}

function showPosts (source, notes, verbose) {
  if (verbose) {
    logger.start(`${notes.length} note(s) from ${source} ...`)
  }
  notes.forEach(note => {
    console.log(`[${note.time}]: ${note.text}`)
  })
  if (verbose) {
    logger.success('.')
  }
}

function getPosts (config, date) {
  runWithNotes(config, date, notes => {
    showPosts(config.getSource(), notes, config.verbose)
  })
}

function saveContent ({ output, verbose }, content) {
  if (!output || !output.length) {
    logger.error('output path not specified')
    return
  } else {
    if (verbose) {
      logger.start('saving content to: ' + output)
    }
    writeFileSync(output, content, { encoding: 'utf8' })
    if (verbose) {
      logger.success('.')
    }
  }
}

function renderPosts (config, date) {
  runWithNotes(config, date, notes => {
    switch (config.format) {
      case 'json':
        const json = JSON.stringify({ [config.date]: notes }, null, config.indent || 2)
        if (config.output) {
          saveContent(config, json)
          return
        } else {
          console.log(json)
          if (config.verbose) {
            logger.success('.')
          }
        }
        break
      case 'markdown':
      case 'md':
        const content = wrapMarkdown({
          title: `Notes ${config.date}`,
          heading: '##'
        }, notes)

        if (content === '') {

        } else {
          if (config.output) {
            saveContent(config, content)
            return
          }
          if (config.verbose) {
            logger.start('rendering content in ' + config.getSource())
          }
          console.log('')
          console.log(content)
          if (config.verbose) {
            logger.success('.')
          }
        }
        break
      default:
        logger.error('unknown format: ' + config.format)
    }
  })
}

exports.addPost = addPost
exports.getPosts = getPosts
exports.renderPosts = renderPosts
