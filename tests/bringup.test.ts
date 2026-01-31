import { describe, it, expect } from "vitest"
import { bringup } from "../src/bringup"
import { BringupError } from "../src/errors"

describe("bringup", () => {
  it("stops execution when a step fails", async () => {
    const executed: string[] = []

    await expect(
      bringup()
        .step("first", async () => {
          executed.push("first")
        })
        .step("fails", async () => {
          executed.push("fails")
          throw new Error("error message")
        })
        .step("never-runs", async () => {
          executed.push("never")
        })
        .run()
    ).rejects.toThrow(BringupError)

    expect(executed).toEqual(["first", "fails"])
  })

  it("throws if a step name is missing", () => {
    expect(() => bringup().step("", () => {})).toThrow(BringupError)
  })

  it("runs all steps when none fail", async () => {
    const executed: string[] = []
  
    await bringup()
      .step("a", () => {
        executed.push("a")
      })
      .step("b", () => {
        executed.push("b")
      })
      .run()
  
    expect(executed).toEqual(["a", "b"])
  })

  it("does not allow adding steps after run", async () => {
    const builder = bringup().step("a", () => {})

    await builder.run()

    expect(() => builder.step("b", () => {})).toThrow(BringupError)
  })

  it("does not allow run to be called more than once", async () => {
    const b = bringup().step("one", () => {})
  
    await b.run()
  
    await expect(b.run()).rejects.toThrow(BringupError)
  })  

})
