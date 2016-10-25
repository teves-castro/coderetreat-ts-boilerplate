import { Board, Coord, evolve } from "./life"

function draw(board: Board, boxSize: number, ctx: CanvasRenderingContext2D) {
  board.liveCoords.forEach(([c, r]: Coord) => {
    const x = c * (boxSize + 1)
    const y = r * (boxSize + 1)
    ctx.fillStyle = "blue"
    ctx.fillRect(x, y, boxSize, boxSize)
    ctx.stroke()
  })
}

export function game(board: Board, boxSize: number) {
  const paper = document.getElementById("paper") as HTMLCanvasElement
  const ctx = paper.getContext("2d")
  if (ctx !== null) {
    let loopId: any
    paper.onclick = () => {
      if (!loopId) {
        loopId = setInterval(() => {
          ctx.clearRect(0, 0, paper.width, paper.height)
          draw(board, boxSize, ctx)
          board = evolve(board)
        }, 1000 / 30)
      } else {
        clearInterval(loopId)
        loopId = undefined
      }
    }
    paper.click()
  }
}
