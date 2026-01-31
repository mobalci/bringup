import { BringupError } from "./errors"

type Step = {
    name: string
    run: () => Promise<void> | void
  }
  
class Bringup {
  private steps: Step[] = []
  private hasRun = false
  
    step(name: string, fn: Step["run"]): this {
      if (!name) {
        throw new BringupError("bringup step requires a name")
      }
  
    if (this.hasRun) {
      throw new BringupError("bringup has already run; cannot add more steps")
    }

    this.steps.push({ name, run: fn })
      return this
    }
  
    async run(): Promise<void> {
    if (this.hasRun) {
      throw new BringupError("bringup has already run; cannot run again")
    }

    this.hasRun = true

      for (const step of this.steps) {
        try {
          await step.run()
        } catch (err) {
          throw new BringupError(
            `bringup failed at step "${step.name}": ${
              err instanceof Error ? err.message : String(err)
            }`
          )
        }
      }
    }
  }
  
  export function bringup(): Bringup {
    return new Bringup()
  }
  