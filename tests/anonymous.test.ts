import { test, expect } from '@playwright/test';
const FRONTEND_URL='http://localhost:3000/';

test('test', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}`);
  await expect(page.locator('div').filter({ hasText: 'Welcome toSCAM !Browse' }).getByRole('button')).toBeVisible();
  await expect(page.locator('body')).toContainText('Browse Restaurants');
  await page.locator('div').filter({ hasText: 'Welcome toSCAM !Browse' }).getByRole('button').click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByRole('button', { name: 'See More' }).dblclick();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.locator('div:nth-child(9) > div:nth-child(2) > div:nth-child(2) > .w-full').click();
  await expect(page.getByText('MenudishdrinksetRed Shrimp w')).toBeVisible();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByText('Red Shrimp w/ Mala Sauce39 ฿').click();
  await page.getByRole('button', { name: 'drink' }).click();
  await expect(page.getByText('Hot Café Latte (No Sugar)40 ฿')).toBeVisible();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByText('Hot Café Latte (No Sugar)40 ฿').click();
  await page.getByRole('button', { name: 'set' }).click();
  await expect(page.getByText('Triple Shrimp80 ฿Shrimp but')).toBeVisible();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
});