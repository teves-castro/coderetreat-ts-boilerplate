import { Range } from "immutable"
import {
  Board,
  game,
  Coord,
} from "./life"

const rnd = (max: number) => Math.floor(Math.random() * max)
const count = rnd(300) + 300
const live = Range(1, count).map(() => [rnd(90), rnd(90)] as Coord).toArray()

let board = new Board(100, 100, live)

game(board, 4)
