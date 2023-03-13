const itemData = require('../../test-data.json')
const  expect = require('chai').expect;
const { remote } = require('webdriverio');
const { assert } = require('chai');

describe('confirm saucedemo items list data', () => {
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

  it('should log in successfully and confirm that items info corresponds with test data', async () => {
    // login and check if inventory list exists on the page
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('standard_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
    const invContainer = browser.$('#inventory_container');
    const elementExists = await invContainer.waitForExist();
    expect(elementExists).to.be.true;
    const invItems = await browser.$('div.inventory_list').$$('div.inventory_item');
    
    /*iterate through inventory items to collect name, description and price data;
      confirm that data corresponds with test data
    */
    for (let i = 0; i < invItems.length; i++) {
      const itemDescriptions = await invItems[i].$$('div.inventory_item_label');
      const itemPrices = await invItems[i].$$('div.pricebar');

      for (let j = 0; j < itemDescriptions.length; j++) {
        const itemName = await itemDescriptions[j].$('div.inventory_item_name').getText();
        const itemDescr = await itemDescriptions[j].$('div.inventory_item_desc').getText();
        const itemPrice = await itemPrices[j].$('div.inventory_item_price').getText();
        const testName = itemData.items[i].name
        const testDescr = itemData.items[i].description
        const testPrice = itemData.items[i].price
        assert(itemName == testName);
        assert(itemDescr == testDescr);
        assert(itemPrice == testPrice);
      }
    }
  });

  after(async () => {
    await browser.deleteSession();
  });
});