import waitFor from "../src/util/waitFor"

describe("wait", () => {
  it("should wait", async () => {
    const start = Date.now()
    await waitFor(1000)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(1000)
  })
})
