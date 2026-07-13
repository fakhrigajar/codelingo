let apiPromise = null

// Loads the YouTube IFrame Player API script once and resolves with the
// global `YT` namespace — needed to read a video's duration and detect
// play/pause so we can track how much of it a learner has actually watched.
export function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.()
      resolve(window.YT)
    }
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}
