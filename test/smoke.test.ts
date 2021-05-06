import { Octokit } from "../src";

describe("Smoke test", () => {
  it("is a function", () => {
    expect(Octokit).toBeInstanceOf(Function);
  });

  it("Octokit.VERSION is set", () => {
    expect(Octokit.VERSION).toEqual("0.0.0-development");
  });
});
