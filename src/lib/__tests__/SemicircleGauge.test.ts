// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import SemicircleGauge from "$lib/components/SemicircleGauge.svelte";
import type { BmiLevel } from "$lib/standards/types";

function makeLevel(id: string, color: string, textColor: string): BmiLevel {
  return {
    id,
    nameKey: `level_${id}`,
    color,
    lightColor: color.replace("bg-", "bg-").replace(/(\d+)/, "100"),
    textColor,
    borderColor: color.replace("bg-", "border-"),
  };
}

const levels: BmiLevel[] = [
  makeLevel("underweight", "bg-blue-500", "text-blue-600"),
  makeLevel("normal", "bg-green-500", "text-green-600"),
  makeLevel("overweight", "bg-amber-500", "text-amber-600"),
  makeLevel("obese", "bg-red-500", "text-red-600"),
];

const levelBounds = [
  { min: 10, max: 18.5 },
  { min: 18.5, max: 24 },
  { min: 24, max: 28 },
  { min: 28, max: 50 },
];

const levelLabels = ["underweight", "normal", "overweight", "obese"];

afterEach(() => cleanup());

describe("SemicircleGauge", () => {
  it("renders SVG element", () => {
    const { container } = render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders gauge segments", () => {
    const { container } = render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });

  it("shows needle when bmi is provided", () => {
    const { container } = render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  it("shows zoom-in label when not zoomed", () => {
    render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    expect(screen.getByText("zoom_in")).toBeTruthy();
  });

  it("shows zoom-out label when zoomed", () => {
    render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: true,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    expect(screen.getByText("zoom_out")).toBeTruthy();
  });

  it("calls ontogglezoom on zoom button click", async () => {
    const ontogglezoom = vi.fn();
    const { container } = render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
      ontogglezoom,
    });
    const zoomBtn = container.querySelector("button")!;
    await fireEvent.click(zoomBtn);
    expect(ontogglezoom).toHaveBeenCalledOnce();
  });

  it("uses dark background in isDark mode", () => {
    const { container } = render(SemicircleGauge, {
      levels, levelBounds, levelLabels,
      bmi: 22, currentIndex: 1,
      zoomedIn: false, isDark: true,
      zoomInLabel: "zoom_in", zoomOutLabel: "zoom_out",
    });
    const bgPath = container.querySelector("path");
    expect(bgPath?.getAttribute("stroke")).toBe("#334155");
  });
});
