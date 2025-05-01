import { test, expect } from '@playwright/test';
test.setTimeout(0);  // Disable timeout for this specific test
const FRONTEND_URL='http://localhost:3000/';

//US5-2-As a restaurant employee-I want to create new menu 
//US5-3-As a restaurant employee-I want to update new menu                                                      
//US5-4-As a restaurant employee-I want to delete the menu

test('Test-Menu Set', async ({ page }) => {
  await page.goto(`${FRONTEND_URL}`);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill('beauemployee@gmail.com');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page.getByRole('button', { name: 'My Restaurant' })).toBeVisible();
  await page.getByRole('button', { name: 'My Restaurant' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  //add
  await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('textbox', { name: 'Menu Name' }).click();
  await page.getByRole('textbox', { name: 'Menu Name' }).fill('Boneca Ambalabu');
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').fill('https://sushiro.co.th/wp-content/uploads/2021/03/401.jpg');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Boneca Ambalabu refers to a frog with two human legs attached to a wheel.');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('3000');
  await page.locator('div').filter({ hasText: /^TypeDishDrinkSet$/ }).getByRole('combobox').selectOption('set');
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Seasonal');
  await page.getByRole('button', { name: 'Add' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByRole('button', { name: 'set' }).click();
  await expect(page.getByText('Boneca Ambalabu3000 ฿Boneca')).toBeVisible();
  //edit
  await page.getByRole('button', { name: 'Edit' }).nth(2).click();
  await page.getByRole('heading', { name: 'Boneca Ambalabu' }).getByRole('textbox').click();
  await page.getByRole('heading', { name: 'Boneca Ambalabu' }).getByRole('textbox').fill('Frong Set Sushi');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('119');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('The frog sushi set');
  await page.getByRole('combobox').selectOption('Locally-sourced');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await expect(page.getByText('Frong Set Sushi119 ฿The frog')).toBeVisible();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  //delete
  await page.getByRole('button', { name: 'Delete' }).nth(2).click();
  await page.getByRole('button', { name: 'set' }).click();
  await expect(page.getByText('Frong Set Sushi119 ฿The frog')).toBeHidden();

});