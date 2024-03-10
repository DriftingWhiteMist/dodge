const gameContainer = document.getElementById('game-container')
var updateValue = 1 / 60
var fps = 2
var board = []
var startTime = Date.now()
var intervalID
var playerLocation
var playerLost = false
var level

const tileColors = {
  GRAY: 0,
  RED: 1,
  YELLOW: 2,
  GREEN: 3,
}

const colorsToCSS = {
  0: 'gray',
  1: 'red',
  2: 'yellow',
  3: 'yellowgreen',
}

function updateDOMState() {
  for (let i = 0; i < 100; i++) {
    let tile = document.getElementById(i.toString())
    let time = board[i]
    if (i === playerLocation) {
      tile.textContent = 'x'
    } else {
      tile.textContent = ''
    }
    tile.style.backgroundColor = colorsToCSS[Math.floor(time)]
  }
  if (playerLost) {
    headingText = 'YOU LOSE | FINAL LEVEL: ' + level
    if (level !== 500) {
      document.getElementById('lose-text').textContent = 'The max level is 500! Try to reach it!'
    } else {
      document.getElementById('lose-text').textContent = 'Congrats you got to level 500!'
      headingText = 'YOU BEAT THE GAME'
    }
  } else {
    headingText = 'Level: ' + level
  }
  document.getElementById('heading').textContent = headingText
}

function gameLoop() {
  let isVacantTile = false
  for (let i = 0; i < 100; i++) {
    if (board[i] > 0) {
      board[i] -= updateValue
    } else if (board[i] <= -1) {
      board[i]++
    } else if (Math.random() <= 0.4) {
      board[i] = -Math.ceil(Math.random() * 1000 * fps)
    } else {
      board[i] = 0
      isVacantTile = true
    }
  }
  if (isVacantTile) {
    let randomIndex = Math.floor(Math.random() * 100)
    while (board[randomIndex] !== 0) {
      randomIndex = Math.floor(Math.random() * 100)
    }
    board[randomIndex] = 4
  }
  updateDOMState()
}

function main() {
  for (let i = 0; i < 100; i++) {
    let tile = document.createElement('button')
    tile.id = i.toString()
    tile.className = 'tile'
    tile.style.backgroundColor = colorsToCSS[tileColors.GREEN]
    tile = gameContainer.appendChild(tile)
    tile.addEventListener('click', () => {
      if (playerLost) return
      playerLocation = i
      updateDOMState()
    })
    board.push(0)
  }
  function waitForPlayer() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (playerLocation !== undefined) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })
  }
  waitForPlayer().then(() => {
    intervalID = setInterval(gameLoop, fps)
    const slowdown = count => {
      if (playerLocation !== undefined) {
        level = 500 - count
        if (Math.floor(board[playerLocation]) === tileColors.RED) {
          count = 1
          clearInterval(intervalID)
          playerLost = true
          updateDOMState()
          return
        }
      }
      if (count === 0) {
        return
      }
      clearInterval(intervalID)
      if (fps > 1 / 60) {
        fps /= 1.005
      }
      if (fps < 1 / 60) {
        fps = 1 / 60
      }
      console.log(+(Math.round(fps + 'e+4') + 'e-4'))
      intervalID = setInterval(gameLoop, fps)
      setTimeout(() => {
        slowdown(count - 1)
      }, 150)
    }
    slowdown(500)
  })
}
main()
