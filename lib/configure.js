const { existsSync } = require('fs')
const path = require('path')
const os = require('os')

const moment = require('moment')

const appHome = path.join(
  process.env[os.platform().indexOf('win') === 0 ? 'USERPROFILE' : 'HOME'],
  '_enpitz'
)

const dateFormat = 'YYYY-MM-DD'

class Config {
  constructor () {
    this.date = moment().format(dateFormat)
    this.homeDir = appHome
  }
  hasHomeDir () {
    return existsSync(this.homeDir)
  }
  hasSource () {
    return existsSync(this.getSource())
  }
  getSource () {
    return path.join(this.homeDir, this.date + '.json')
  }
  setDate (newDate) {
    if (moment.isMoment(newDate)) {
      this.date = newDate.format(dateFormat)
    } else {
      this.date = newDate
    }
  }
}

module.exports = Config
