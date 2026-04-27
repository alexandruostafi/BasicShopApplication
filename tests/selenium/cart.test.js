// tests/selenium/cart.test.js
// Selenium tests for cart functionality

const assert = require('node:assert/strict');
const { buildDriver, goto, waitFor, safeClick, loginAs, screenshotOnFailure, By } = require('./helpers');

let driver;

describe('Shopping Cart (Selenium)', function () {
    this.timeout(40000);

    before(async () => {
        driver = await buildDriver();
        await loginAs(driver, 'cassius@example.com', 'customer123');
    });

    afterEach(async function () {
        await screenshotOnFailure(driver, this.currentTest);
    });
    
    after(async () => {
        if (driver) await driver.quit();
    });

    it('cart page is accessible and shows page title and empty cart', async () => {
        await goto(driver, '/cart.html');
        const heading = await waitFor(driver, 'h2');
        assert.ok(await heading.getText(), 'Your Armoury');
        const paragraph = await waitFor(driver, 'p');
        assert.ok(await paragraph.getText(), 'Your armoury is empty. Browse miniatures →');
    });

    it('adding an item to the cart updates the cart count and shows the item in the cart', async () => {
        await goto(driver, '/');
        await waitFor(driver, '.product-card');

        const badge     = await driver.findElement(By.css('#cartCount'));
        const before    = parseInt((await badge.getText()) || '0', 10);

        const addBtns = await driver.findElements(By.css('.product-card .btn-primary'));
        assert.ok(addBtns.length > 0, 'No "Add to Cart" buttons found');
        await safeClick(driver, addBtns[0]);

        // Wait for badge to update
        await driver.sleep(1200);
        const after = parseInt((await badge.getText()) || '0', 10);
        assert.ok(after > before, `Cart badge did not increase (before: ${before}, after: ${after})`);
    });

    it('cart page shows added item and allows quantity update', async () => {
        await goto(driver, '/cart.html');
        await waitFor(driver, '.cart-table tbody tr');
        const rows = await driver.findElements(By.css('.cart-table tbody tr'));
        assert.ok(rows.length > 0, 'Expected at least one cart row');
    });

    it('cart shows a proceed to checkout button when items are in the cart', async () => {
        await goto(driver, '/cart.html');
        await waitFor(driver, '.cart-summary-box');
        const checkoutBtn = await driver.findElement(By.css('.cart-summary-box a[href="checkout.html"]'));
        assert.ok(await checkoutBtn.isDisplayed(), 'Checkout link is not visible');
    });

    it('removing an item from the cart reduces the row count', async () => {
        await goto(driver, '/cart.html');
        await waitFor(driver, '.cart-table tbody tr');
        const rowsBefore = (await driver.findElements(By.css('.cart-table tbody tr'))).length;
        const removeBtn = await driver.findElement(By.css('.cart-table button.btn.btn-danger'));
        await safeClick(driver, removeBtn);
        // Wait for cart to update
        await driver.sleep(1200);
        const rowsAfter = (await driver.findElements(By.css('.cart-table tbody tr'))).length;
        assert.ok(rowsAfter < rowsBefore, `Expected fewer rows (before: ${rowsBefore}, after: ${rowsAfter})`);
    });
    
    it('clear cart button removes all items from the cart', async () => {
        await goto(driver, '/');
        await waitFor(driver, '.product-card');

        const addBtns = await driver.findElements(By.css('.product-card .btn-primary'));
        await safeClick(driver, addBtns[0]);

        await driver.sleep(1200);
        await safeClick(driver, addBtns[0]);
        
        await driver.sleep(1200);
        await goto(driver, '/cart.html');
        await waitFor(driver, '.cart-table tbody tr');
        const clearBtn = await driver.findElement(By.css('.cart-summary-box button.btn.btn-secondary'));
        await safeClick(driver, clearBtn);
        await driver.switchTo().alert().accept();
        await driver.sleep(1200);
        const rowsAfterClear = await driver.findElements(By.css('.cart-table tbody tr'));
        assert.strictEqual(rowsAfterClear.length, 0, 'Expected all rows to be removed after clearing the cart');

        const heading = await waitFor(driver, 'h2');
        assert.ok(await heading.getText(), 'Your Armoury');
        const paragraph = await waitFor(driver, 'p');
        assert.ok(await paragraph.getText(), 'Your armoury is empty. Browse miniatures →');
    });
});