import { assert } from "chai"
import { Cell, evolve, evolveCell, Board, Coord, contains } from "../src/index"

describe("Cell", () => {
  describe(".evolve", () => {
    const live: Cell = [[0, 0], true]
    const dead: Cell = [[0, 0], false]
    describe("on a live cell", () => {
      [2, 3].forEach(n => {
        describe(`with ${n} neighbours`, () => {
          it("should produre a live cell", () => {
            assert.deepEqual(evolveCell(live, n), live)
          })
        })
      })
    })

    describe("on a live cell", () => {
      [0, 1, 4, 5, 6, 7, 8].forEach(n => {
        describe(`with ${n} neighbours`, () => {
          it("should produre a dead cell", () => {
            assert.deepEqual(evolveCell(live, n), dead)
          })
        })
      })
    })

    describe("on a dead cell", () => {
      describe("with 3 neighbours", () => {
        it("should produre a live cell", () => {
          assert.deepEqual(evolveCell(dead, 3), live)
        })
      })
    })

    describe("on a dead cell", () => {
      [0, 1, 2, 4, 5, 6, 7, 8].forEach(n => {
        describe(`with ${n} neighbours`, () => {
          it("should produre a dead cell", () => {
            assert.deepEqual(evolveCell(dead, n), dead)
          })
        })
      })
    })
  })
})

describe("Board", () => {

  const emptyBoard = new Board(3, 3, [])
  const underpopulatedBoard = new Board(3, 3, [[1, 1], [2, 2]])
  const survivorBoard = new Board(3, 3, [[0, 1], [1, 1], [1, 2], [2, 2]])
  const fullBoard = new Board(3, 3, [
    [0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]])
  const diagonalBoard = new Board(3, 3, [[0, 0], [1, 1], [2, 2]]);

  describe(".init on a diagonal board", () => {
    [0, 1, 2].forEach(i => {
      describe(`cell @[${i},${i}]`, () => {
        it("should be alive", () => {
          assert.isTrue(diagonalBoard.state([i, i]))
        })
      })
    })
  })

  describe(".init on a diagonal board", () => {
    [0, 1, 2].forEach(c => {
      [0, 1, 2].forEach(r => {
        if (c !== r) {
          describe(`cell @[${c},${r}]`, () => {
            it("should be dead", () => {
              assert.isFalse(diagonalBoard.state([c, r]))
            })
          })
        }
      })
    })
  })

  describe(".neighboursOf", () => {

    function totalNeighbours(board: Board) {
      return board.coords
        .map((c: Coord) => board.neighboursOf(c))
        .reduce((sum, i) => sum + i, 0)
    }

    describe("on an emptyBoard", () => {
      emptyBoard.coords.forEach(c => {
        it(`should return 0 for cell ${c}`, () => {
          assert.isTrue(emptyBoard.neighboursOf([0, 0]) === 0)
        })
      })
    })

    describe("on underpopulatedBoard", () => {
      it("total neighbours should be 11", () => {
        const result = totalNeighbours(underpopulatedBoard)
        assert.equal(result, 11)
      })
    })

    describe("on survivorBoard", () => {
      it("total neighbours should be 22", () => {
        const result = totalNeighbours(survivorBoard)
        assert.equal(result, 21)
      })
    })

    describe("on fullBoard", () => {
      it("total neighbours should be 40", () => {
        const result = totalNeighbours(fullBoard)
        assert.equal(result, 40)
      })
    })
  })

  describe(".evolve", () => {
    describe("on an all dead board", () => {
      it("should continue with all cells dead", () => {
        assert.equal(evolve(emptyBoard).liveCoords, emptyBoard.liveCoords)
      })
    })

    describe("on under populated board", () => {
      it("should kill all cells", () => {
        const next = evolve(underpopulatedBoard)
        assert.equal(next.liveCoords, emptyBoard.liveCoords)
      })
    })

    describe("on survive board", () => {
      const next = evolve(survivorBoard).liveCoords
      const member = contains(next)
      it("should have two new cells born", () => {
        assert.isTrue(member([0, 2]))
        assert.isTrue(member([2, 1]))
      })
    })

    describe("on fullBoard board", () => {
      const next = evolve(fullBoard).liveCoords
      const member = contains(next)
      it("should keep on the corners alive", () => {
        assert.isTrue(member([0, 0]))
        assert.isTrue(member([0, 2]))
        assert.isTrue(member([2, 0]))
        assert.isTrue(member([2, 2]))
      })
      it("should kill central cross", () => {
        assert.isFalse(member([1, 0]))
        assert.isFalse(member([1, 1]))
        assert.isFalse(member([1, 2]))
        assert.isFalse(member([0, 1]))
        assert.isFalse(member([2, 1]))
      })
    })
  })
})
