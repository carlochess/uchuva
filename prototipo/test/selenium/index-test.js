var assert = require('assert');
var selenium = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var driver;

const timeOut = 15000;
// http://testerstories.com/2016/02/javascript-with-selenium-webdriver-and-mocha/

// java -jar selenium-server-standalone-2.45.0.jar

test.before(function() {
  this.timeout(timeOut);
  driver = new selenium.Builder().
      withCapabilities(selenium.Capabilities.chrome()).
      //usingServer('http://localhost:4444/wd/hub').
      build();
  driver.get("http://localhost:3000/");
});

test.after(function() {
  driver.quit();
});

test.afterEach(function() {
  driver.manage().deleteAllCookies();
});

test.describe('Title is uchuva', function() {
  test.it('provides no default weight', function() {
    driver.getTitle().then(function(title) {
        assert.equal(title, "Uchuva");
    });
  });

  test.it('H1 title is uchuva', function() {
    driver.findElement(selenium.By.id('titulo')).getText().then(function(weight) {
      assert.equal(weight, "Uchuva");
    });
  });
});
/*
http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html
let link = yield driver.findElement(By.id('link'));
      yield driver.actions()
          .mouseMove(link)
          .click()
          .perform();
driver.actions().
  keyDown(Key.SHIFT).
  click(element1).
  click(element2).
  dragAndDrop(element3, element4).
  keyUp(Key.SHIFT).
  perform();
*/
