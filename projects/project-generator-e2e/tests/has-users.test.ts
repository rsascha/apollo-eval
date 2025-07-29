import test, { expect } from "@playwright/test";
import { url } from "./url";

test("has users", async ({ page }) => {
  await page.goto(url);
  const usersList = page.locator('ul[data-testid="users-list"]');
  await expect(usersList).toBeVisible();

  // Check if the list has at least one user
  const usersCount = await usersList.locator("li").count();
  expect(usersCount).toBeGreaterThan(0);

  // Optionally, check for specific users
  const knownUsers = ["John Doe", "Jane Smith"];
  for (const user of knownUsers) {
    const userLocator = usersList.locator(`li:has-text("${user}")`);
    await expect(userLocator).toBeVisible();
  }
});
