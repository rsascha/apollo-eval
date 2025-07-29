import { expect, test } from "@playwright/test";
import { url } from "./url";

test("hello query has one of known greetings", async ({ page }) => {
  const knownGreetings = ["Hello!", "Hi there!", "Welcome!", "Good day!"];
  await page.goto(url);
  const helloQuery = page.locator('span[data-testid="greetings-subscription"]');
  await expect(helloQuery).toBeVisible();
  await page.waitForTimeout(3000);
  const helloText = await helloQuery.textContent();
  expect(helloText).toBeDefined();
  expect(knownGreetings).toContain(helloText);
});
