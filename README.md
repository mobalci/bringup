# bringup

**bringup** is a small helper for defining and enforcing application startup.

Most applications have an implicit startup sequence: load config, connect to services, warm caches, verify state. That logic often ends up scattered around, partially ordered, or mixed with runtime code.

**bringup** makes startup explicit. You define a set of steps, run them once, and either the application starts or it doesn’t.

Startup is treated as a single, intolerant phase. If something fails, startup stops immediately.

Usage looks like this:

```ts
import { bringup } from "bringup"

await bringup()
  .step("load config", loadConfig)
  .step("connect database", connectDatabase)
  .step("warm cache", warmCache)
  .run()
  ```

Steps run sequentially. If a step throws, startup stops and the original error is surfaced.

**bringup** enforces a few invariants:
- startup can only run once
- steps can’t be added after execution starts
- steps always run in the order they were defined
- the first failure aborts startup
- startup failures are wrapped in a `BringupError` with the original error preserved as the cause

Errors during startup are treated as fatal by default. If startup fails, the application should not continue running in a half-initialized state.

This is part of a small internal kit intended to make application startup explicit and hard to misuse.