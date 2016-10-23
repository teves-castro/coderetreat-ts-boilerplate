import { List, Range } from "immutable"

export function evolveCell(cell: Cell, liveNeighbours: number): Cell {
  const [coords, currentState] = cell
  const state = liveNeighbours === 3 || liveNeighbours > 1 && liveNeighbours < 4 && currentState
  return [coords, state]
}

export function evolve(board: Board): Board {
  const newLiveCoords =
    board.coords
      .map((c: Coord) => {
        const cell: Cell = [c, state(board, c)]
        const neighbours = neighboursOf(board, c)
        return evolveCell(cell, neighbours)
      })
      .filter(([, s]: Cell) => s)
      .map(([c]: Cell) => c)
      .toList()
  const newBoard = Object.assign({}, board, { liveCoords: newLiveCoords })
  return newBoard
}

export function contains(coords: List<Coord>) {
  return ([c, r]: Coord) => {
    return coords.some(([cc, cr]: Coord) => cc === c && cr === r)
  }
}
export function state(board: Board, c: Coord) {
  return contains(board.liveCoords)(c)
}

export function neighboursOf(board: Board, coord: Coord) {
  return board.liveCoords.filter((c: Coord) => areNeighbours(c, coord)).count()
}

export function areNeighbours([c1, r1]: Coord, [c2, r2]: Coord) {
  return (
    c1 === c2 && Math.abs(r1 - r2) === 1 ||
    r1 === r2 && Math.abs(c1 - c2) === 1 ||
    Math.abs(c1 - c2) === 1 && Math.abs(r1 - r2) === 1
  )
}

export type Coord = [number, number]
export type Cell = [Coord, boolean]

export class Board {
  public readonly coords: List<Coord>
  public readonly liveCoords: List<Coord>
  public readonly cols: number
  public readonly rows: number

  constructor(cols: number, rows: number, cells: Coord[]) {
    const coords = Range(0, cols).flatMap(c => Range(0, rows).map(r => [c, r] as Coord)).toArray()
    this.coords = List<Coord>(coords)
    this.liveCoords = List<Coord>(cells)
  }
}

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
        }, 1000 / 25)
      } else {
        clearInterval(loopId)
        loopId = undefined
      }
    }
    paper.click()
  }
}
