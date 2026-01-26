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
})
