import { Range } from "immutable"
import {
  Board,
  game,
  Coord,
} from "./life"

const rnd = (max: number) => Math.floor(Math.random() * max)
const count = rnd(300) + 1300
const live = Range(1, count).map(() => [rnd(200), rnd(200)] as Coord).toArray()

let board = new Board(live)

game(board, 2)
