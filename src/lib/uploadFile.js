// Attachments stay in the browser as data URLs and persist with their post.
export async function uploadFile(dataUrl, filename = '') {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=\s]*)$/.exec(dataUrl)
  if (!match) throw new Error('Could not read that file.')
  const size = Math.floor(match[2].replace(/\s/g, '').length * 3 / 4)
  if (size > 2 * 1024 * 1024) throw new Error('Choose a file smaller than 2 MB for browser storage.')
  return { url: dataUrl, mime: match[1], name: filename }
}
