# Testing From Beginning

This folder is intentionally reset to empty test suites.

## Current state
- No active unit tests
- No active integration tests
- `npm test` will pass even when no tests are present

## Start your first unit test
1. Create a file in `tests/unit/` ending with `.test.ts`
2. Keep one simple test first
3. Run `npm test`

Example starter template:

```ts
// tests/unit/example.test.ts
describe("example", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(2);
  });
});
```

## Start your first integration test
1. Create a file in `tests/integration/` ending with `.test.ts`
2. Test one route (for example `/api/health`)
3. Run `npm test`

Example starter template:

```ts
// tests/integration/health.test.ts
import request from "supertest";
import app from "../../src/app";

describe("GET /api/health", () => {
  it("returns server status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
  });
});
```
