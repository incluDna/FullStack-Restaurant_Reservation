import { test, expect } from '@playwright/test';
test.setTimeout(0);  // Disable timeout for this specific test
const FRONTEND_URL='http://localhost:3000/';

//US5-2-As a restaurant employee-I want to create new menu 
//US5-3-As a restaurant employee-I want to update new menu                                                      
//US5-4-As a restaurant employee-I want to delete the menu


test('Test-Menu Dish', async ({ page }) => {
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
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Image URL$/ }).getByRole('textbox').fill('https://sushiro.co.th/wp-content/uploads/2021/03/001.jpg');
  await page.getByRole('textbox', { name: 'Menu Name' }).click();
  await page.getByRole('textbox', { name: 'Menu Name' }).fill('Tralalero Tralala');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1000');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('He has a son, Merdardo, who is friends with Zip Zip Gnoccolino. He also met Benito Mussolini.');
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Halal');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Nut-free');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('form div').filter({ hasText: 'TagSelect a tagSpicy - Dish' }).getByRole('combobox').selectOption('Signature-dish');
  await page.getByRole('button', { name: 'Add' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Tralalero Tralala1000 ฿He has')).toBeVisible();
  //edit
  await expect(page.getByText('Tralalero Tralala1000 ฿He has')).toBeVisible();
    await expect(page.locator('body')).toContainText('Tralalero Tralala');
    await page.getByRole('button', { name: 'Edit' }).nth(1).click();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().fill('Shark Sushi');
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('59');
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('Fresh new Shark with nike Sushi');
    await page.getByRole('button', { name: 'Halal' }).click();
    await page.getByRole('combobox').selectOption('Seasonal');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Nut-free')).toBeVisible();
    await expect(page.getByText('Signature-dish').nth(1)).toBeVisible();
    await expect(page.getByText('Seasonal')).toBeVisible();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await expect(page.getByText('Shark Sushi59 ฿Fresh new')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Shark Sushi' })).toBeVisible();
    //delete
    await expect(page.getByRole('heading', { name: 'Shark Sushi' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).nth(1).click();
    await expect(page.getByText('Shark Sushi59 ฿Fresh new')).toBeHidden();

});


  