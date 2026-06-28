export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080
export const ROOT_VALUE = 192

export function pxToRem(px) {
  return `${px / ROOT_VALUE}rem`
}

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
