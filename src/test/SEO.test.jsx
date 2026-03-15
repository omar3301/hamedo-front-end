import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import SEO from "../components/SEO";

beforeEach(() => {
  document.title = "";
});

describe("SEO component", () => {
  it("sets document title with site name", () => {
    render(<SEO title="Nike Air Zoom" />);
    expect(document.title).toBe("Nike Air Zoom — HamedoSport");
  });

  it("uses default title when no title prop", () => {
    render(<SEO />);
    expect(document.title).toContain("HamedoSport");
  });

  it("sets og:title meta tag", () => {
    render(<SEO title="Test Product" />);
    const og = document.querySelector('meta[property="og:title"]');
    expect(og?.getAttribute("content")).toContain("Test Product");
  });

  it("sets description meta tag", () => {
    render(<SEO description="Great padel racket" />);
    const desc = document.querySelector('meta[name="description"]');
    expect(desc?.getAttribute("content")).toBe("Great padel racket");
  });

  it("sets og:image when image prop is provided", () => {
    render(<SEO image="https://example.com/photo.jpg" />);
    const ogImg = document.querySelector('meta[property="og:image"]');
    expect(ogImg?.getAttribute("content")).toBe("https://example.com/photo.jpg");
  });
});
