// tests/selenium/auth.test.js
// Selenium tests for register and login flows

const assert = require(`node:assert/strict`);
const {buildDriver, goto, waitFor, loginAs, By, until} = require(`./helpers`)

let driver;
const UNIQUE = Date.now();

describe(`Authentication`, function() {
  this.timeout(30000);

  before(async(async () => {
    driver = await buildDriver();
  }));

  after(async() => {
    await driver.quit();
  });

  // -- Register --

  it('register page loads with a form', async () => {
    await goto(driver, '/register.html');
    await waitFor(driver, '#registerForm');
    const heading = await driver.findElement(By.css('h2'));
    assert.ok((await heading.getText()).includes('Create Account'));
  });

});
