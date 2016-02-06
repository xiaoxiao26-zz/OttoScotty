var assert = require('chai').assert;
const Browser = require('zombie');

url = "https://www.facebook.com/messages/"

describe("Run Otto", function() {
  const browser = new Browser();

  it("should visit the site and see the login form", function(next) {
    this.timeout(0); // disable mocha timeout
    browser.visit(url, function(err) {

        browser.dump();

        assert.ok(browser.success);
        assert.equal(browser.text('h2'), 'Log into FacebookLog into Facebook');

        browser.fill('input[name=email]', 'ottoscotty@gmail.com');
        browser.fill('input[name=pass]', 'TMxR4ICWRyp4HQebHWrK');
        //browser.fill('email', 'ottoscotty@gmail.com');
        //browser.fill('pass', 'TMxR4ICWRyp4HQebHWrK');
        browser.pressButton('Log In')

        browser.dump();
        assert.equal(browser.text('body'), 'BBBBBBBBBBBB');

        next();
    });
  });

});
