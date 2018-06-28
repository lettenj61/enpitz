const { spawnSync } = require('child_process')
const { existsSync } = require('fs')
const path = require('path')

const logger = require('consola')

function quitOnError (command, args, options) {
  const { error, status } = spawnSync(command, args, options)
  if (error) {
    logger.error('failed to execute: ' + command + ' ' + args.join(' '))
    logger.error(error)

    process.exit(status)
  }
}

function setup (config) {
  const gitMetadataPath = path.join(config.homeDir, '.git')
  if (existsSync(gitMetadataPath)) {
    logger.info('git repository already initialized')
    logger.success('.')
    return
  } else {
    const cwd = config.homeDir
    logger.start('preparing git repository in ' + cwd)
    quitOnError('git', ['init', '-q'], { cwd })
    logger.success('.')
  }
}

exports.setup = setup