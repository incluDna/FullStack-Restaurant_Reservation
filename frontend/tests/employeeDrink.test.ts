import { test, expect } from '@playwright/test';
test.setTimeout(0);  // Disable timeout for this specific test
const FRONTEND_URL='http://localhost:3000/';

//US5-2-As a restaurant employee-I want to create new menu 
//US5-3-As a restaurant employee-I want to update new menu                                                      
//US5-4-As a restaurant employee-I want to delete the menu

test('Test-Menu Drink', async ({ page }) => {
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
  await page.getByRole('textbox', { name: 'Menu Name' }).fill('Ballerina Cappuccina');
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').fill('https://sushiro.co.th/wp-content/uploads/2021/03/751_Iced-Cafe-Latte-No-Sugar_011.jpg');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('2000');
  await page.locator('div').filter({ hasText: /^TypeDishDrinkSet$/ }).getByRole('combobox').selectOption('drink');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('She was a graceful woman with a cappuccino cup for a head, known for her surreal ballet');
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Gluten-free');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Vegetarian');
  await page.getByRole('button', { name: 'Add' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(2000); // wait for 2 sec for loading page
  await page.getByRole('button', { name: 'drink' }).click();
  await expect(page.getByText('Ballerina Cappuccina2000 ฿She')).toBeVisible();
  //edited
  await page.getByRole('button', { name: 'Edit' }).nth(2).click();
  await page.getByRole('heading', { name: 'Ballerina Cappuccina' }).getByRole('textbox').click();
  await page.getByRole('heading', { name: 'Ballerina Cappuccina' }).getByRole('textbox').fill('Iced Café Latte');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('55');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('Very cold latte?');
  await page.getByRole('button', { name: 'Gluten-free' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await expect(page.getByText('Iced Café Latte55 ฿Very cold')).toBeVisible();
  //delete
  await page.getByRole('button', { name: 'Delete' }).nth(2).click();
  await page.getByRole('button', { name: 'drink' }).click();
  await expect(page.getByText('Iced Café Latte55 ฿Very cold')).toBeHidden();

});
  