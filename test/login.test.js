const  expect = require('chai').expect;
const { remote } = require('webdriverio');

describe('Saucedemo Login', () => {
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

  after(async () => {
    await browser.deleteSession();
  });
});
