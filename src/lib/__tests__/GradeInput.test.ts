// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import GradeInput from "$lib/components/GradeInput.svelte";
import { stageGroups } from "$lib/standards/china-student";

afterEach(() => cleanup());

describe("GradeInput", () => {
  it("renders stage label", () => {
    render(GradeInput, { selectedGrade: "grade-7", stageGroups });
    expect(screen.getByText("stage")).toBeTruthy();
  });

  it("renders all stage groups", () => {
    const { container } = render(GradeInput, { selectedGrade: "grade-7", stageGroups });
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("highlights the selected grade", () => {
    const { container } = render(GradeInput, { selectedGrade: "grade-7", stageGroups });
    const buttons = container.querySelectorAll("button");
    const selectedBtn = Array.from(buttons).find(
      (b) => b.textContent === "stage_grade7"
    );
    expect(selectedBtn?.className).toContain("bg-blue-500");
  });

  it("shows reset button", () => {
    render(GradeInput, { selectedGrade: "grade-10", stageGroups });
    expect(screen.getByText("reset")).toBeTruthy();
  });
});
