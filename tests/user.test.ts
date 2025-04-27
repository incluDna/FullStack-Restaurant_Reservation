import { test, expect } from '@playwright/test';
const FRONTEND_URL='http://localhost:3000/';

// US5-1-As a customer I want to view menu before reserve restaurant 
test('test', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}`);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('beauuser@gmail.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('123456');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.locator('div').filter({ hasText: 'Welcome toSCAM !Browse' }).getByRole('button').click();
    await page.locator('div').filter({ hasText: 'See More' }).click();
    await page.getByRole('button', { name: 'See More' }).click();
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

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });