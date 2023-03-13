const  expect = require('chai').expect;
const { assert } = require('chai');
const { remote } = require('webdriverio');

describe('Saucedemo different users login', () => {
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

  it('should log in successfully', async () => {
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('standard_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
    const invContainer = browser.$('#inventory_container');
    const elementExists = await invContainer.waitForExist();
    expect(elementExists).to.be.true;
  });

  it('should receive error message when logging in', async () => {
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('locked_out_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
    const errMsg = await browser.$('#login_button_container > div > form > div.error-message-container.error > h3');
    const elementExists = await errMsg.waitForExist();
    expect(elementExists).to.be.true;
  });

  it('should login, but all items have same images', async () => {
    await browser.url('https://www.saucedemo.com/');
    await browser.$('#user-name').setValue('problem_user');
    await browser.$('#password').setValue('secret_sauce');
    await browser.$('#login-button').click();
    const invContainer = browser.$('#inventory_container');
    const elementExists = await invContainer.waitForExist();
    expect(elementExists).to.be.true;
    const invItems = await browser.$('div.inventory_list').$$('div.inventory_item');

    let imgList = [];
    for (let i = 0; i < invItems.length; i++) {
      const itemImgElem = await invItems[i].$('img');
      const imgSrc = await itemImgElem.getAttribute('src');
      if (imgList.includes(imgSrc)) {
        continue;
      }
      imgList.push(imgSrc);
      }
    assert.equal(imgList.length, 1, 'should be equal to 1');
    });

  after(async () => {
    await browser.deleteSession();
  });
});