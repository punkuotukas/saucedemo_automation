const { remote } = require('webdriverio');
const assert = require('assert');

describe('add items to cart', () => {
  let browser;

  before(async () => {
    browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions':{
          args: ['headless']
        }
      }
    });
  });

  it('should add items to cart', async () => {
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('standard_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
  
    // Wait for the inventory items to be displayed
    const invList = await browser.$('.inventory_list');
    await invList.waitForDisplayed();
  
    // Select and click the buttons
    const buttons = await invList.$$('.btn.btn_primary.btn_small.btn_inventory');
    let itemsNum = 0;
    for (let i = 0; i < buttons.length; i++) {
      await buttons[i].click();
      if (i == 0) {
        const cartBadge = browser.$('#shopping_cart_container > a > span');
        await cartBadge.isDisplayed();
        itemsNum = await cartBadge.getText();
        assert (itemsNum == 1);
      }
      else if (i > 0) {
        const cartBadge = browser.$('#shopping_cart_container > a > span');
        await cartBadge.isDisplayed();
        itemsNum = await cartBadge.getText();
        assert (itemsNum == i+1);
      }
    }
    assert (itemsNum == 6);
  });

  after(async () => {
    await browser.deleteSession();
  });
});
