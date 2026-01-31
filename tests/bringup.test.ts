import { describe, it, expect } from "vitest"
import { bringup } from "../src/bringup"

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
    ).rejects.toThrow(/fails/)

    expect(executed).toEqual(["first", "fails"])
  })

  it("throws if a step name is missing", () => {
    expect(() => bringup().step("", () => {})).toThrow()
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

})
