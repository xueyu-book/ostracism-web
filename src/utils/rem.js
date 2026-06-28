const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const ROOT_VALUE = 192

function setRootFontSize() {
  const { clientWidth, clientHeight } = document.documentElement
  const scale = Math.min(
    clientWidth / DESIGN_WIDTH,
    clientHeight / DESIGN_HEIGHT
  )
  document.documentElement.style.fontSize = `${ROOT_VALUE * scale}px`
}

setRootFontSize()
window.addEventListener('resize', setRootFontSize)
