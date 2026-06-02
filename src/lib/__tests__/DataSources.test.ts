// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import DataSources from "$lib/components/DataSources.svelte";

afterEach(() => cleanup());

describe("DataSources", () => {
  it("renders collapsed by default", () => {
    render(DataSources, { showDataSources: false });
    expect(screen.getByText("data_source")).toBeTruthy();
    expect(screen.queryByText("source_1_title")).toBeNull();
  });

  it("shows sources when expanded", () => {
    render(DataSources, { showDataSources: true });
    expect(screen.getByText("source_1_title")).toBeTruthy();
    expect(screen.getByText("source_2_title")).toBeTruthy();
    expect(screen.getByText("source_3_title")).toBeTruthy();
    expect(screen.getByText("source_4_title")).toBeTruthy();
  });

  it("toggles content on click", async () => {
    const { container } = render(DataSources, { showDataSources: false });
    const toggle = container.querySelector("section button")!;
    await fireEvent.click(toggle);
    expect(screen.getByText("source_1_title")).toBeTruthy();
  });
});
