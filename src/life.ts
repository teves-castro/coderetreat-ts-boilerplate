import { Set, Iterable } from "immutable"

export type Coord = [number, number]
export type Cell = [Coord, boolean]

export function evolveCell(cell: Cell, liveNeighbours: number): Cell {
  const [coords, currentState] = cell
  const state = liveNeighbours === 3 || liveNeighbours > 1 && liveNeighbours < 4 && currentState
  return [coords, state]
}

export class Board {
  public liveCoords: Set<Coord>

  constructor(liveCells: Coord[]) {
    this.liveCoords = Set<Coord>(liveCells)
  }
}

function surround([c, r]: Coord): Iterable.Indexed<Coord>[] {
  return [
    [c - 1, r - 1], [c, r - 1], [c + 1, r - 1],
    [c - 1, r], [c, r], [c + 1, r],
    [c - 1, r + 1], [c, r + 1], [c + 1, r + 1],
  ].map(Iterable)
}

export function evolve(board: Board): Board {
  const liveCoords =
    board.liveCoords
      .flatMap<number, Iterable.Indexed<Coord>>(surround)
      .toSet()
      .map((c: Iterable.Indexed<Coord>) => {
        const cc: Coord = c.toArray() as any as Coord
        const cell: Cell = [cc, state(board, cc)]
        const neighbours = neighboursOf(board, cc)
        return evolveCell(cell, neighbours)
      })
      .filter(([, s]: Cell) => s)
      .map(([c]: Cell) => c)
      .toSet()

  const newBoard = Object.assign({}, board, {
    liveCoords,
  })
  return newBoard
}

export function contains(coords: Set<Coord>) {
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
