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
        const cell: Cell = [c, board.state(c)]
        const neighbours = board.neighboursOf(c)
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

  public state(c: Coord) {
    return contains(this.liveCoords)(c)
    // return this.liveCoords.contains([c, r])
  }

  public neighboursOf(coord: Coord) {
    return this.liveCoords.filter((c: Coord) => this.areNeighbours(c, coord)).count()
  }

  private areNeighbours([c1, r1]: Coord, [c2, r2]: Coord) {
    return (
      c1 === c2 && Math.abs(r1 - r2) === 1 ||
      r1 === r2 && Math.abs(c1 - c2) === 1 ||
      Math.abs(c1 - c2) === 1 && Math.abs(r1 - r2) === 1
    )
  }
}

const board = new Board(3, 3, [[0, 1], [1, 1], [1, 2], [2, 2]])
const next = evolve(board)
console.log(board.liveCoords.toArray())
console.log(next.liveCoords.toArray())
