export class BringupError extends Error {
    constructor(message: string) {
      super(message)
      this.name = "BringupError"
    }
  }  