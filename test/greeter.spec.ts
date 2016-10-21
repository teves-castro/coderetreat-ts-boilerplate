import { expect } from "chai"
import { greeter } from "../src/greeter"

describe("Greeter", () => {
  describe("greet", () => {
    it("should return the suplied name with a greeting", () => {
      const name = "Code Retreat"
      const expected = `Hello, ${name}!`
      const result = greeter(name)
      expect(result).to.equal(expected)
    })
  })
})
