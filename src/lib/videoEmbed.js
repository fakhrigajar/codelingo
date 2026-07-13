// YouTube page/share URLs (watch?v=, youtu.be, shorts) can't be played by a
// plain <video> tag — they need to go through YouTube's iframe embed player.
export function getYouTubeVideoId(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, '')
  if (host === 'youtu.be') {
    return parsed.pathname.slice(1).split('/')[0] || null
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
    const match = parsed.pathname.match(/^\/(embed|shorts)\/([^/?]+)/)
    if (match) return match[2]
  }
  return null
}

// Returns an iframe-embeddable URL for known video-sharing sites, or null if
// the URL should instead be played directly with a <video> tag (e.g. a
// direct .mp4 link).
export function getVideoEmbedUrl(url) {
  const id = getYouTubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
