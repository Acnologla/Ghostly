const keys = { w: false, s: false, a: false, d: false }

window.addEventListener('keydown', (e) => {
  if (keys[e.key.toLowerCase()] === false) {
    keys[e.key.toLowerCase()] = true
  }
})

window.addEventListener('keyup', (e) => {
  if (keys[e.key.toLowerCase()] === true) {
    keys[e.key.toLowerCase()] = false
  }
})

export { keys }
