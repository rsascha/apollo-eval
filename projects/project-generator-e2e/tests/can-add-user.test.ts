import { expect, test } from "@playwright/test";
import { url } from "./url";

test("can add user", async ({ page }) => {
  await page.goto(url);

  // Check if the add user input and button are visible
  const addUserInput = page.locator('input[data-testid="add-user-input"]');
  const addUserButton = page.locator('button[data-testid="add-user-button"]');

  await expect(addUserInput).toBeVisible();
  await expect(addUserButton).toBeVisible();

  // Add a new user
  const newUserName = "TestUser";
  await addUserInput.fill(newUserName);
  await addUserButton.click();

  await page.waitForTimeout(3000);

  // Verify the new user is added to the list
  const usersList = page.locator('ul[data-testid="users-list"]');
  const newUserLocator = usersList
    .locator(`li:has-text("${newUserName}")`)
    .first();

  await expect(newUserLocator).toBeVisible();
});
