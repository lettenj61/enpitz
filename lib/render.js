function renderMarkdown (heading, note) {
  return (note && note.text)
    ? heading + ' ' + note.time + '\n\n' + note.text + '\n\n'
    : ''
}

function renderNotes (heading, notes) {
  let buf = ''
  notes.forEach(note => {
    buf += renderMarkdown(heading, note)
  })

  return buf
}

function wrapMarkdown ({ title, heading }, notes) {
  if (notes == null || !notes.length) {
    return ''
  }

  let content = ''

  // Deal with page headings.
  // TODO: front matter
  content += `# ${title}`
  content += '\n\n'

  // Render all items.
  content += renderNotes(heading, notes)

  return content
}

exports.wrapMarkdown = wrapMarkdown
