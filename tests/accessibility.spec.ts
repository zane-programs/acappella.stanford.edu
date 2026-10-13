import { test, expect, type Page } from "@playwright/test";
import { createRequire } from "node:module";

const requireModule = createRequire(`${process.cwd()}/package.json`);
const axePath = requireModule.resolve("axe-core/axe.min.js");

async function audit(page: Page) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async () => {
    const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
    const result = await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    });
    return result.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }));
  });
}

test.beforeEach(async ({ page }) => {
  // Audit the site's own UI without depending on third-party player or analytics availability.
  await page.route(/googletagmanager|google-analytics|youtube|spotify/, (route) => route.abort());
});

for (const width of [1280, 375, 320]) {
  test(`pages have accessible markup, contrast and reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const groups = await page.locator("#groups a").evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    expect(groups).toHaveLength(11);
    for (const path of ["/", "/about", "/shows", "/privacy", "/not-a-group", ...groups]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await audit(page), path).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path}: horizontal overflow`).toBe(true);
    }
  });
}

test("skip link and anchor navigation move focus, and routes announce their destination", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.getByRole("link", { name: "Meet the groups" }).click();
  await expect(page.locator("#groups")).toBeFocused();
  await page.locator('#groups a[href="/counterpoint"]').click();
  await expect(page).toHaveURL(/\/counterpoint$/);
  await expect(page.locator("#main-content")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#groups")).toBeFocused();
});

test("mobile menu traps focus, closes with Escape and preserves destination focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  expect(await audit(page)).toEqual([]);
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("#main-content")).toBeFocused();
});

test("reduced motion prevents video loading and responds while animations are active", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos: string[] = [];
  page.on("request", (request) => {
    if (/hero-loop.*\.(webm|mp4)/.test(request.url())) videos.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator("[data-intro]")).toBeHidden();
  expect(videos).toEqual([]);
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe("auto");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(page.locator("video")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator("[data-intro]")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
  const opacities = await page.locator("[data-reveal]").evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(opacities.every((opacity) => opacity === "1")).toBe(true);

  // A fresh session with motion enabled exercises changing the preference during a wipe.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about");
  await page.getByRole("link", { name: "Shows", exact: true }).first().click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page).toHaveURL(/\/shows$/);
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("#main-content")).toHaveCSS("opacity", "1");
});

test("normal-motion navigation and notice dismissal keep keyboard focus visible", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Got it", exact: true }).click();
  await expect(page.locator("#main-content")).toBeFocused();
  await page.getByRole("link", { name: "Shows", exact: true }).first().click();
  await expect(page).toHaveURL(/\/shows$/);
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("#main-content")).toHaveCSS("opacity", "1");
});

test("group photo transitions settle when motion preferences change", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: "Groups", exact: true }).first().click();
  await expect(page.locator("#groups")).toBeFocused();
  await page.locator('#groups a[href="/counterpoint"]').click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page).toHaveURL(/\/counterpoint$/);
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("#main-content")).toHaveCSS("opacity", "1");
  await expect(page.locator('[data-shared-image="counterpoint"]')).toHaveCSS("opacity", "1");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about");
  await page.getByRole("link", { name: "Groups", exact: true }).first().click();
  await expect(page.locator("#groups")).toBeFocused();
  await page.locator('#groups a[href="/counterpoint"]').click();
  await expect(page.locator("#main-content")).toBeFocused();
  await page.goBack();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#groups")).toBeFocused();
  await expect(page.locator("#main-content")).toHaveCSS("opacity", "1");
  await expect(page.locator('[data-shared-image="counterpoint"]')).toHaveCSS("opacity", "1");
});
