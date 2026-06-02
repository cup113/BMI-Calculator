// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import HeightInput from "$lib/components/HeightInput.svelte";

afterEach(() => cleanup());

describe("HeightInput", () => {
  it("renders height input with placeholder", () => {
    render(HeightInput, { height: "" });
    const input = screen.getByPlaceholderText("height_placeholder");
    expect(input).toBeTruthy();
  });

  it("shows validation when height < 50", () => {
    render(HeightInput, { height: "30" });
    expect(screen.getByText("height_validation")).toBeTruthy();
  });

  it("shows validation when height > 300", () => {
    render(HeightInput, { height: "350" });
    expect(screen.getByText("height_validation")).toBeTruthy();
  });

  it("does not show validation for valid height", () => {
    render(HeightInput, { height: "170" });
    expect(screen.queryByText("height_validation")).toBeNull();
  });

  it("shows cm unit label", () => {
    const { container } = render(HeightInput, { height: "" });
    expect(container.textContent).toContain("cm");
  });
});
