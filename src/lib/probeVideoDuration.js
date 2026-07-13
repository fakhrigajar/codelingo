import { getYouTubeVideoId } from './videoEmbed'
import { loadYouTubeIframeApi } from './youtubeApi'

// A direct video file's duration is available from its metadata alone — no
// need to render it anywhere, a detached <video> element is enough.
function probeDirectVideo(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    const finish = (duration) => {
      video.src = ''
      resolve(duration)
    }
    video.onloadedmetadata = () => finish(Number.isFinite(video.duration) ? video.duration : null)
    video.onerror = () => finish(null)
    video.src = url
  })
}

// YouTube only exposes duration through the IFrame Player API, which needs a
// real (if invisible) iframe to attach to — parked off-screen and torn down
// the moment we have the number.
function probeYouTubeVideo(videoId) {
  return loadYouTubeIframeApi().then(
    (YT) =>
      new Promise((resolve) => {
        const host = document.createElement('div')
        host.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;'
        document.body.appendChild(host)

        let settled = false
        let player = null
        const finish = (duration) => {
          if (settled) return
          settled = true
          clearTimeout(failTimer)
          player?.destroy?.()
          host.remove()
          resolve(duration)
        }
        const failTimer = setTimeout(() => finish(null), 8000)

        player = new YT.Player(host, {
          videoId,
          events: {
            onReady: (e) => finish(e.target.getDuration() || null),
            onError: () => finish(null),
          },
        })
      }),
  )
}

// Resolves a video URL's duration in seconds (or null if it can't be
// determined), without ever showing anything to the user.
export function probeVideoDuration(url) {
  const youtubeId = getYouTubeVideoId(url)
  return youtubeId ? probeYouTubeVideo(youtubeId) : probeDirectVideo(url)
}
