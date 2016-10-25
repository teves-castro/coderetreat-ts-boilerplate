import { List, Set } from "immutable"

export type Coord = [number, number]
export type Cell = { coord: Coord, state: boolean }

export function evolveCell(cell: Cell, liveNeighbours: number): Cell {
  const {coord, state} = cell
  const newState = liveNeighbours === 3 || state && liveNeighbours > 1 && liveNeighbours < 4
  return { coord, state: newState }
}

export class Board {
  public liveCoords: Set<Coord>

  constructor(liveCells: Coord[]) {
    this.liveCoords = Set<Coord>(liveCells)
  }
}

function getNeighbours([c, r]: Coord): List<number>[] {
  return [
    [c - 1, r - 1], [c, r - 1], [c + 1, r - 1],
    [c - 1, r], [c, r], [c + 1, r],
    [c - 1, r + 1], [c, r + 1], [c + 1, r + 1],
  ].map(List)
}

export function evolve(board: Board): Board {
  function evolveMapper(c: List<Number>) {
    const coord = c.toArray() as Coord
    const currentState = state(board, coord)
    const neighbours = neighboursOf(board, coord)
    return evolveCell({ coord, state: currentState }, neighbours)
  }
  function isAlive({state}: Cell) {
    return state
  }

  const liveCoords =
    board.liveCoords
      .flatMap(getNeighbours)
      .toSet()
      .map(evolveMapper)
      .filter(isAlive)
      .map(cell => cell!.coord)
      .toSet()

  const newBoard = Object.assign({}, board, { liveCoords })
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
