// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import AgeInput from "$lib/components/AgeInput.svelte";

afterEach(() => cleanup());

describe("AgeInput", () => {
  it("renders age label", () => {
    render(AgeInput, { age: "" });
    expect(screen.getByText("age")).toBeTruthy();
  });

  it("renders input with placeholder 5-19", () => {
    render(AgeInput, { age: "" });
    const input = screen.getByPlaceholderText("5-19");
    expect(input).toBeTruthy();
  });

  it("shows age range hint", () => {
    const { container } = render(AgeInput, { age: "" });
    const hint = container.querySelector("span");
    expect(hint?.textContent).toContain("5-19");
  });

  it("displays the bound age value", () => {
    render(AgeInput, { age: 10 });
    const input = screen.getByDisplayValue("10");
    expect(input).toBeTruthy();
  });
});
