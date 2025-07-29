import { expect, test } from "@playwright/test";
import { url } from "./url";

test("has title", async ({ page }) => {
  await page.goto(url);
  await expect(page).toHaveTitle("Vite + React + TS");
});
