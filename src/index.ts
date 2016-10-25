import { Range } from "immutable"
import { Board, Coord } from "./life"
import { game } from "./game"


const rnd = (max: number) => Math.floor(Math.random() * max)
const count = rnd(300) + 1000
const live = Range(1, count).map(() => [rnd(130), rnd(130)] as Coord).toArray()

let board = new Board(live)

game(board, 3)
