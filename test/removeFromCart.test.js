const { remote } = require('webdriverio');
const assert = require('assert');

describe('remove items from cart', () => {
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

  it('should add items to cart, remove them afterwards and assert that items number in cart is correct', async () => {
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('standard_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
  
    // Wait for the inventory items to be displayed
    const invList = await browser.$('.inventory_list');
    await invList.waitForDisplayed();
  
    // Select and click add buttons
    const addButtons = await invList.$$('.btn.btn_primary.btn_small.btn_inventory');
    let itemsNum = 0;
    for (let i = 0; i < addButtons.length; i++) {
      await addButtons[i].click();
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

    // // Select and click remove buttons
    const removeButtons = await invList.$$('.btn.btn_secondary.btn_small.btn_inventory');
    let itemsLeft = itemsNum
    for (let i = 6; i >= 1; i--) {
        if (i > 1) {
            await removeButtons[0].click();
            const cartBadge = browser.$('#shopping_cart_container > a > span');
            await cartBadge.isDisplayed();
            itemsLeft = await cartBadge.getText();
            assert (itemsLeft == i-1);
        }
        else if (i == 1) {
            await removeButtons[0].click();
            assert (browser.$('#shopping_cart_container > a > span').waitForExist({ reverse: true})); // assert that shopping cart size badge does not exist after last item is removed
        }
        }
    
  });

  after(async () => {
    await browser.deleteSession();
  });
});
