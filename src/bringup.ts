type Step = {
    name: string
    run: () => Promise<void> | void
  }
  
  class Bringup {
    private steps: Step[] = []
  
    step(name: string, fn: Step["run"]): this {
      if (!name) {
        throw new Error("bringup step requires a name")
      }
  
      this.steps.push({ name, run: fn })
      return this
    }
  
    async run(): Promise<void> {
      for (const step of this.steps) {
        try {
          await step.run()
        } catch (err) {
          throw new Error(
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
  